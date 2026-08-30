import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Thought } from "@/models/Thought";
import { ThoughtView } from "@/models/ThoughtView";
import { getUserNameMap } from "@/lib/attachUserNames";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";

async function trackView(thoughtId: mongoose.Types.ObjectId, viewerId: string) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  try {
    await ThoughtView.findOneAndUpdate(
      { thoughtId, viewerId, lastViewedAt: { $lt: startOfToday } },
      { $set: { lastViewedAt: now } },
      { upsert: true, new: true },
    );

    await Thought.findByIdAndUpdate(thoughtId, { $inc: { views: 1 } });
  } catch (err: any) {
    if (err.code !== 11000) {
      console.log("View tracking error", err);
    }
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid thought ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const thoughtObjectId = new mongoose.Types.ObjectId(id);

    const thoughts = await Thought.aggregate([
      { $match: { _id: thoughtObjectId } },
      {
        $lookup: {
          from: "thoughtfeedbacks",
          let: { id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$thoughtId", "$$id"] } } },
            { $sort: { createdAt: -1 } },
          ],
          as: "feedback",
        },
      },
    ]);

    if (!thoughts || thoughts.length === 0) {
      return NextResponse.json({ error: "Thought not found" }, { status: 404 });
    }

    const thought = thoughts[0];
    const userNameMap = await getUserNameMap([thought.userId]);
    thought.userName = userNameMap.get(thought.userId);

    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id) {
      await trackView(thoughtObjectId, session.user.id);
    }

    return NextResponse.json(thought, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 },
    );
  }
}
