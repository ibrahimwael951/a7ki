import { connectDB } from "@/lib/mongoDB";
import { ContactMessage } from "@/models/Contact_Message";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, company, userId } = body;
    if (company) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 });
    }
    if (!userId) {
      return Response.json({ error: "Try again later" }, { status: 400 });
    }
    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { message: "Email must be a valid @gmail.com address" },
        { status: 400 }
      );
    }
    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }
    if (message.length <= 20) {
      return Response.json(
        { error: "Type More than 20 letter, add more details to your message" },
        { status: 400 }
      );
    }

    await connectDB();
    const newMessage = await ContactMessage.create({
      userId,
      name,
      email,
      message,
    });
    return NextResponse.json(newMessage, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
  
    if (!userId) {
      return NextResponse.json("Id Not Found", { status: 401 });
    }
    const Messages = await ContactMessage.find({ userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(Messages, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
