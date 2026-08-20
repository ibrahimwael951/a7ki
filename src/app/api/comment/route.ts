import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Comment } from "@/models/Comment";
import { Thought } from "@/models/Thought";
import mongoose from "mongoose";

// ---------- CREATE (top-level comment OR reply to a comment) ----------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { thoughtId, userId, content, parentCommentId } = body;

    if (!thoughtId || !mongoose.Types.ObjectId.isValid(thoughtId)) {
      return NextResponse.json({ error: "Invalid thought ID" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }
    if (content.trim().length > 1000) {
      return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
    }

    await connectDB();

    // Make sure the thought actually exists
    const thoughtExists = await Thought.exists({ _id: thoughtId });
    if (!thoughtExists) {
      return NextResponse.json({ error: "Thought not found" }, { status: 404 });
    }

    // If it's a reply, make sure the parent comment exists and belongs to the same thought
    if (parentCommentId) {
      if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
        return NextResponse.json({ error: "Invalid parent comment ID" }, { status: 400 });
      }
      const parent = await Comment.findOne({
        _id: parentCommentId,
        thoughtId,
      });
      if (!parent) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
    }

    const newComment = await Comment.create({
      thoughtId,
      userId,
      content: content.trim(),
      parentCommentId: parentCommentId || null,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}

// ---------- EDIT ----------
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { commentId, userId, content } = body;

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }
    if (content.trim().length > 1000) {
      return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
    }

    await connectDB();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Ownership check — only the author can edit their comment
    if (comment.userId !== userId) {
      return NextResponse.json({ error: "You can't edit this comment" }, { status: 403 });
    }

    comment.content = content.trim();
    comment.edited = true;
    await comment.save();

    return NextResponse.json(comment, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}

// ---------- REMOVE (cascades to all nested replies) ----------
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { commentId, userId } = body;

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectDB();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== userId) {
      return NextResponse.json({ error: "You can't delete this comment" }, { status: 403 });
    }

    // Find every descendant reply (reply of a reply of a reply, however deep)
    const tree = await Comment.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(commentId) } },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentCommentId",
          as: "descendants",
        },
      },
      { $project: { descendantIds: "$descendants._id" } },
    ]);

    const idsToDelete = [
      new mongoose.Types.ObjectId(commentId),
      ...(tree[0]?.descendantIds ?? []),
    ];

    await Comment.deleteMany({ _id: { $in: idsToDelete } });

    return NextResponse.json(
      { message: "Comment and its replies deleted", deletedCount: idsToDelete.length },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}