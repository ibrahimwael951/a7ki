import { connectDB } from "@/lib/mongoDB";
import { ContactChatMessage } from "@/models/ContactChatMessage";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    let userId = url.searchParams.get("userId");
    const isAdmin = session.user.role === "admin";

    if (!userId) {
      userId = session.user.id;
    }

    // Normal users can only view their own chat messages
    if (!isAdmin && userId !== session.user.id) {
      return NextResponse.json("Forbidden", { status: 403 });
    }

    await connectDB();
    const messages = await ContactChatMessage.find({ userId }).sort({
      createdAt: 1,
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { message, name, email, userId } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json("Message is required", { status: 400 });
    }

    const isAdmin = session.user.role === "admin";
    let targetUserId = userId;
    let senderName = session.user.name || name || "Anonymous User";
    let senderEmail = session.user.email || email;

    if (isAdmin) {
      if (!targetUserId) {
        return NextResponse.json("targetUserId is required for admin replies", {
          status: 400,
        });
      }
    } else {
      targetUserId = session.user.id;
    }

    await connectDB();

    const newMessage = await ContactChatMessage.create({
      userId: targetUserId,
      senderId: session.user.id,
      senderName,
      senderEmail,
      senderRole: isAdmin ? "admin" : "user",
      message: message.trim(),
    });

    return NextResponse.json(newMessage, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
