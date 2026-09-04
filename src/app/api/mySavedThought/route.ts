import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { SavedThought } from "@/models/SavedThought";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 200 },
      );
    }

    await connectDB();

    const userSavedThoughts = await SavedThought.find({
      userId: session.user.id,
    }).select("thoughtId");

    const savedThoughtIds = userSavedThoughts.map((savedThought) =>
      savedThought.thoughtId.toString(),
    );

    if (!savedThoughtIds || savedThoughtIds.length === 0) {
      return NextResponse.json({ thoughts: [] }, { status: 200 });
    }

    const thoughts = await mongoose.model("Thought").find({
      _id: { $in: savedThoughtIds },
    });

    const result = thoughts.map((item) => ({
      _id: item._id,
      thought: item.thought,
      createdAt: item.createdAt,
      views: item.views,
    }));

    return NextResponse.json({ thoughts: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 },
    );
  }
}
