import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Comment } from "@/models/Comment";
import mongoose from "mongoose";

type FlatComment = {
  _id: mongoose.Types.ObjectId;
  parentCommentId: mongoose.Types.ObjectId | null;
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
        // orphaned reply (parent was somehow removed) — surface it as a root
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ thoughtId: string }> }
) {
  try {
    const { thoughtId } = await params;

    if (!thoughtId || !mongoose.Types.ObjectId.isValid(thoughtId)) {
      return NextResponse.json({ error: "Invalid thought ID" }, { status: 400 });
    }

    await connectDB();

    const comments = await Comment.find({ thoughtId })
      .sort({ createdAt: 1 })
      .lean();

    const tree = buildTree(comments as FlatComment[]);

    return NextResponse.json(tree, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}