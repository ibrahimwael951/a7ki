import { connectDB } from "@/lib/mongoDB";
import { NextResponse } from "next/server";
import { ContactMessage } from "@/models/Contact_Message";

export async function POST(req: Request) {
  try {
    await connectDB();

    const dailyMessages = await ContactMessage.aggregate([
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

    return NextResponse.json(dailyMessages, { status: 200 });
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
