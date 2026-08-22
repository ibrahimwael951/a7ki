import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Comment } from "@/models/Comment";
import { Thought } from "@/models/Thought";
import mongoose from "mongoose";
import axios from "axios";

async function classifyComment(
  content: string,
  locale: string,
): Promise<{
  approved: boolean;
  problem: string;
}> {
  const response = await axios.post(
    `${process.env.AI_API}/responses`,
    {
      model: process.env.AI_MODEL,
      input: `You are a content moderation classifier for a comment on a personal thought/story.

Analyze the following comment and determine whether it should be approved.

Respond with STRICT JSON only, no markdown, no code fences, no extra text.
The JSON must have exactly this shape:
{"approved": <true or false>, "problem": "<short reason why it was rejected, empty string if approved>"}

Rejection guidance — set "approved" to false if the comment:
- Contains sexual content, Haram content, or explicit/inappropriate language
- Is hateful, harassing, insulting, or targets someone with abuse
- Is spam, gibberish, a random single word, an ad, or a copy-pasted unrelated link
- Contains binary/code dumps or content unrelated to a normal human comment
- Is a threat of violence or self-harm encouragement toward the thought's author

Approval guidance — set "approved" to true if the comment:
- Is a normal, human, supportive, curious, or conversational reply — even if short (e.g. "im sorry you're going through this", "same happened to me", "stay strong")
- Disagrees or gives criticism but does so respectfully

For the "problem" string (language: ${locale}):
- Keep it short — one sentence, no more than ~12 words
- Talk directly to the commenter, explaining what's wrong with what they wrote
- Leave it as an empty string "" if approved is true

Comment to analyze: ${content}
`,
      max_output_tokens: 100000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AI_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const messageBlock = response.data.output.find(
    (item: any) => item.type === "message",
  );
  const rawText: string = messageBlock?.content?.[0]?.text ?? "";

  try {
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      approved: typeof parsed.approved === "boolean" ? parsed.approved : false,
      problem: parsed.problem ?? "",
    };
  } catch {
    // If the model didn't return valid JSON, fail safe by rejecting
    // (safer default than silently letting unmoderated content through)
    return {
      approved: false,
      problem: "Could not verify this comment right now, please try again.",
    };
  }
}

// ---------- CREATE (top-level comment OR reply to a comment) ----------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { thoughtId, userId, content, parentCommentId, locale } = body;

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

    // AI moderation pass before creating the comment
    const { approved, problem } = await classifyComment(
      content.trim(),
      locale || "en",
    );

    if (!approved) {
      return NextResponse.json(
        { error: "Comment rejected", problem },
        { status: 422 },
      );
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
    const { commentId, userId, content, locale } = body;

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

    // AI moderation pass before saving the edit
    const { approved, problem } = await classifyComment(
      content.trim(),
      locale || "en",
    );

    if (!approved) {
      return NextResponse.json(
        { error: "Comment rejected", problem },
        { status: 422 },
      );
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