import { connectDB } from "@/lib/mongoDB";
import { NextResponse } from "next/server";
import { Thought } from "@/models/Thought";

export async function GET() {
  try {
    await connectDB();

    const dailyThoughts = await Thought.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          messages: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          messages: 1,
        },
      },
      {
        $sort: { day: 1 },
      },
    ]);

    return NextResponse.json(dailyThoughts, { status: 200 });
  } catch (err) {
     return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
