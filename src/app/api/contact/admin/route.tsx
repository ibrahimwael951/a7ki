import { connectDB } from "@/lib/mongoDB";
import { NextResponse } from "next/server";
import { ContactMessage } from "@/models/Contact_Message";

export async function POST(req: Request) {
  try {
    await connectDB();
    const ALLMessages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(ALLMessages, { status: 200 });
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
        { message: "Message id not found" },
        { status: 400 }
      );
    }
    await connectDB();
    const Message = await ContactMessage.findOne({ _id });
    if (!Message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 400 }
      );
    }

    await ContactMessage.deleteOne({ _id });

    return NextResponse.json("Message deleted successfully", { status: 200 });
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
