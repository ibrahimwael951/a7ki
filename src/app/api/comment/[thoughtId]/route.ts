import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Comment } from "@/models/Comment";
import { getUserNameMap } from "@/lib/attachUserNames";
import mongoose from "mongoose";

type FlatComment = {
  _id: mongoose.Types.ObjectId;
  parentCommentId: mongoose.Types.ObjectId | null;
  userId: string;
  userName?: string;
  createdAt: Date | string;
  [key: string]: any;
};

function buildTree(flat: FlatComment[]) {
  const byId = new Map<string, any>();
  const roots: any[] = [];

  flat.forEach((c) => {
    byId.set(c._id.toString(), { ...c, replies: [] });
  });

  flat.forEach((c) => {
    const node = byId.get(c._id.toString());
    if (c.parentCommentId) {
      const parent = byId.get(c.parentCommentId.toString());
      if (parent) {
        parent.replies.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

const DEFAULT_PAGE_LIMIT = 10;
const DEFAULT_REPLIES_LIMIT = 0;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ thoughtId: string }> },
) {
  try {
    const { thoughtId } = await params;

    if (!thoughtId || !mongoose.Types.ObjectId.isValid(thoughtId)) {
      return NextResponse.json({ error: "Invalid thought ID" }, { status: 400 });
    }

    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(
        parseInt(url.searchParams.get("limit") || String(DEFAULT_PAGE_LIMIT), 10),
        1,
      ),
      50,
    );
    const repliesLimit = Math.min(
      Math.max(
        parseInt(
          url.searchParams.get("repliesLimit") || String(DEFAULT_REPLIES_LIMIT),
          10,
        ),
        1,
      ),
      20,
    );
    const skip = (page - 1) * limit;

    await connectDB();

    const thoughtObjectId = new mongoose.Types.ObjectId(thoughtId);

    // Only counting/paginating TOP-LEVEL comments — replies are handled
    // separately per-comment so a thread with 200 replies doesn't blow
    // the "10 comments per page" budget.
    const totalTopLevel = await Comment.countDocuments({
      thoughtId: thoughtObjectId,
      parentCommentId: null,
    });

    const topLevelComments = await Comment.find({
      thoughtId: thoughtObjectId,
      parentCommentId: null,
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (topLevelComments.length === 0) {
      return NextResponse.json(
        {
          comments: [],
          page,
          hasMore: skip + topLevelComments.length < totalTopLevel,
        },
        { status: 200 },
      );
    }

    const topLevelIds = topLevelComments.map((c) => c._id);

    // One round trip fetches every descendant (replies, replies-of-replies,
    // however deep) for every top-level comment on this page.
    const descendantsResult = await Comment.aggregate([
      { $match: { _id: { $in: topLevelIds } } },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentCommentId",
          as: "descendants",
        },
      },
      { $project: { _id: 1, descendants: 1 } },
    ]);

    const descendantsByTop = new Map<string, any[]>();
    descendantsResult.forEach((doc) => {
      descendantsByTop.set(doc._id.toString(), doc.descendants || []);
    });

    // Resolve every author name involved in one shot
    const allUserIds: string[] = [];
    topLevelComments.forEach((c) => allUserIds.push(c.userId));
    descendantsResult.forEach((doc) => {
      (doc.descendants || []).forEach((d: any) => allUserIds.push(d.userId));
    });
    const userNameMap = await getUserNameMap(allUserIds);

    const comments = topLevelComments.map((top) => {
      const topIdStr = top._id.toString();
      const descendants: FlatComment[] = (descendantsByTop.get(topIdStr) || [])
        .slice()
        .sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

      const withNames: FlatComment[] = [
        { ...top, userName: userNameMap.get(top.userId) },
        ...descendants.map((d) => ({
          ...d,
          userName: userNameMap.get(d.userId),
        })),
      ];

      const tree = buildTree(withNames);
      const topNode =
        tree.find((n) => n._id.toString() === topIdStr) ?? {
          ...top,
          userName: userNameMap.get(top.userId),
          replies: [],
        };

      const allDirectReplies = topNode.replies || [];
      const totalReplies = allDirectReplies.length;
      const shownReplies = allDirectReplies.slice(0, repliesLimit);

      return {
        ...topNode,
        replies: shownReplies,
        totalReplies,
        hasMoreReplies: totalReplies > shownReplies.length,
      };
    });

    return NextResponse.json(
      {
        comments,
        page,
        hasMore: skip + topLevelComments.length < totalTopLevel,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 },
    );
  }
}