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

// GET /api/comment/replies?commentId=...&skip=0&limit=3
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    const skip = Math.max(parseInt(url.searchParams.get("skip") || "0", 10), 0);
    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get("limit") || "3", 10), 1),
      20,
    );

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
    }

    await connectDB();

    const commentObjectId = new mongoose.Types.ObjectId(commentId);

    const exists = await Comment.exists({ _id: commentObjectId });
    if (!exists) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const result = await Comment.aggregate([
      { $match: { _id: commentObjectId } },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentCommentId",
          as: "descendants",
        },
      },
      { $project: { descendants: 1 } },
    ]);

    const descendants: FlatComment[] = (result[0]?.descendants || [])
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const userNameMap = await getUserNameMap(descendants.map((d) => d.userId));

    const withNames = descendants.map((d) => ({
      ...d,
      userName: userNameMap.get(d.userId),
    }));

    const tree = buildTree(withNames); // direct replies to commentId, fully nested

    const total = tree.length;
    const page = tree.slice(skip, skip + limit);

    return NextResponse.json(
      {
        replies: page,
        hasMore: skip + page.length < total,
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