import { connectDB } from "@/lib/mongoDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { Thought } from "@/models/Thought";
import { ContactMessage } from "@/models/Contact_Message";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Id Not Found" }, { status: 400 });
    }

    await connectDB();

    const userThoughts = await Thought.aggregate([
      {
        $match: {
          userId: id,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "thoughtfeedbacks",
          localField: "_id",
          foreignField: "thoughtId",
          as: "feedback",
        },
      },
    ]);

    const userContactMessages = await ContactMessage.find({
      userId: new ObjectId(id),
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      { userThoughts, userContactMessages },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/user failed:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
