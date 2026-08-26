import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Thought } from "@/models/Thought";
import mongoose from "mongoose";

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

    const thoughts = await Thought.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "thoughtfeedbacks",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$thoughtId", "$$id"] },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ],
          as: "feedback",
        },
      },
      {
        $lookup: {
          from: "user",
          let: { userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: "$_id" }, "$$userId"] },
              },
            },
            {
              $project: { name: 1 },
            },
          ],
          as: "author",
        },
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ["$author.name", 0] },
        },
      },
      {
        $project: {
          author: 0,
        },
      },
    ]);

    if (!thoughts || thoughts.length === 0) {
      return NextResponse.json({ error: "Thought not found" }, { status: 404 });
    }

    return NextResponse.json(thoughts[0], { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 },
    );
  }
}
