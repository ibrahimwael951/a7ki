import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { BetterAuthUser } from "@/lib/betterAuthUser";

export async function GET() {
  try {
    await connectDB();

    const dailyUsers = await BetterAuthUser.aggregate([
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

    return NextResponse.json(dailyUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users", details: (error as Error).message },
      { status: 500 }
    );
  }
}
