import { connectDB } from "@/lib/mongoDB";
import { NextResponse } from "next/server";
import { Thought } from "@/models/Thought";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const thoughts = await Thought.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "thoughtfeedbacks",
          localField: "_id",
          foreignField: "thoughtId",
          pipeline: [
            { $sort: { createdAt: -1 } },
          ],
          as: "feedback",
        },
      },
    ]);

    return NextResponse.json(thoughts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { _id } = body;
    if (!_id) {
      return NextResponse.json(
        { message: "Thought id not found" },
        { status: 400 }
      );
    }
    await connectDB();
    const Message = await Thought.findOne({ _id });
    if (!Message) {
      return NextResponse.json(
        { message: "Thought not found" },
        { status: 400 }
      );
    }

    await Thought.deleteOne({ _id });

    return NextResponse.json("Thought deleted successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
