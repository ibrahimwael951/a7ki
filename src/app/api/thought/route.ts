import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Thought } from "@/models/Thought";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "Unknown";
    const body = await req.json();
    const { thought, userId } = body;

    if (!userId) return NextResponse.json("Bad Credential", { status: 400 });
    if (!thought)
      return NextResponse.json("you should Type your Story", { status: 400 });

    await connectDB();

    // just for finding out where is the Anonymous (Like : Egypt, Canada, USA and etc...)
    let country = "Unknown";
    if (ip !== "Unknown") {
      try {
        const res = await fetch(
          `${process.env.IP_LOCATION_LINK}${ip}?token=${process.env.IP_LOCATION_TOKEN}`
        );
        const data = await res.json();
        country = `${data.continent || "Unknown continent"}, ${
          data.country || "Unknown country"
        }`;
      } catch (err) {
        return NextResponse.json("Failed to fetch IP location", {
          status: 400,
        });
      }
    }

    let rank = null;
    try {
      const response = await axios.post(
        `${process.env.AI_API}/responses`,
        {
          model: process.env.AI_MODEL,
          input: `You are a content moderation classifier.
  Analyze the following message and determine whether it contains sexual content.

  Respond with ONE word only, based on your confidence level:

  bad → if you are 100% certain the message is sexual

  kinda bad → if you are ~70% sure the message is sexual

  okay → if you are ~50% unsure or neutral

  good → if you are ~20% sure or confident it is not sexual

  Unknown → if you cannot determine confidently

  Do not explain your reasoning.
  Do not add punctuation.
  Do not add extra text.

Message to analyze:
${thought}`,
          max_output_tokens: 9000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.AI_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const messageBlock = response.data.output.find(
        (item: any) => item.type === "message"
      );
      rank = messageBlock?.content?.[0]?.text ?? "Unknown";
    } catch (err) {
      return NextResponse.json("Failed to fetch AI Response", {
        status: 400,
      });
    }

    await Thought.create({
      userId,
      thought,
      country,
      rank,
    });

    return NextResponse.json("Created Successfully", {
      status: 200,
    });
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
    await connectDB();

    const Thoughts = await Thought.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "thoughtfeedbacks",
          let: { thoughtId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$thoughtId", "$$thoughtId"] },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ],
          as: "feedback",
        },
      },
    ]);

    return NextResponse.json(Thoughts, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { message, thoughtId } = body;

    if (!thoughtId) {
      return NextResponse.json("thought ID Not Found", { status: 401 });
    }
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    await connectDB();

    let rank = null;
    try {
      const response = await axios.post(
        `${process.env.AI_API}/responses`,
        {
          model: process.env.AI_MODEL,
          input: `You are a content moderation classifier.
                Analyze the following message and determine whether it contains sexual content.

                Respond with ONE word only, based on your confidence level:

                bad → if you are 100% certain the message is sexual

                kinda bad → if you are ~70% sure the message is sexual

                okay → if you are ~50% unsure or neutral

                good → if you are ~20% sure or confident it is not sexual

                Unknown → if you cannot determine confidently

                Do not explain your reasoning.
                Do not add punctuation.
                Do not add extra text.

              Message to analyze:
              ${message}`,
          max_output_tokens: 9000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.AI_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const messageBlock = response.data.output.find(
        (item: any) => item.type === "message"
      );
      rank = messageBlock?.content?.[0]?.text ?? "Unknown";
    } catch (err) {
      return NextResponse.json("Failed to fetch AI Response", {
        status: 400,
      });
    }

    const thought = await Thought.findByIdAndUpdate(thoughtId, {
      thought: message,
      rank,
    });

    if (!thought) {
      return NextResponse.json({ error: "Thought not found" }, { status: 404 });
    }
    return NextResponse.json(thought, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
