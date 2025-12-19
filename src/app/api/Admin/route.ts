import { connectDB } from "@/lib/mongoDB";
import { is_admin } from "@/models/Is_Admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json("UserId Not Found", { status: 400 });
    }
    await connectDB();
    const IsAdmin = await is_admin.findOne({ userId });

    return IsAdmin
      ? NextResponse.json("Welcome back Mr.Admin", { status: 200 })
      : NextResponse.json("You are not the Admin", { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
