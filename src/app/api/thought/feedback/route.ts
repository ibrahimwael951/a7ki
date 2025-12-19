import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { ThoughtFeedback } from "@/models/ThoughtFeedback";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { thoughtId, AdminName, message } = body;

    if (!AdminName) return NextResponse.json("Bad Credential", { status: 400 });
    if (!thoughtId)
      return NextResponse.json("no thoughtId founded", { status: 400 });
    if (!message)
      return NextResponse.json("you should Type your Message", { status: 400 });

    await connectDB();

    const FeedBack = await ThoughtFeedback.create({
      AdminName,
      thoughtId,
      message,
    });

    return NextResponse.json(FeedBack, {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
