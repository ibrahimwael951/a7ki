import { getUserNameMap } from "@/lib/attachUserNames";
import { connectDB } from "@/lib/mongoDB";
import { Thought } from "@/models/Thought";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 10;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(
        parseInt(url.searchParams.get("limit") || String(DEFAULT_LIMIT), 10),
        1,
      ),
      50,
    );
    const skip = (page - 1) * limit;

    await connectDB();
    const filter = { rank: { $ne: "bad" } };

    const total = await Thought.countDocuments(filter);

    const thoughts = await Thought.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const userNameMap = await getUserNameMap(thoughts.map((th) => th.userId));

    const withNames = thoughts.map((th) => ({
      ...th,
      userName: userNameMap.get(th.userId),
    }));

    return NextResponse.json(
      {
        thoughts: withNames,
        page,
        hasMore: skip + thoughts.length < total,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 },
    );
  }
}
