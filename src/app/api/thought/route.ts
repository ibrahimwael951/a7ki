import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Thought } from "@/models/Thought";
import axios from "axios";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Shared helper so POST and PUT don't duplicate the same AI call/parsing logic.
async function classifyThought(
  thought: string,
  locale: string,
): Promise<{
  rank: string;
  comment: string;
  wantEdit: string;
}> {
  const response = await axios.post(
    `${process.env.AI_API}/responses`,
    {
      model: process.env.AI_MODEL,
      input: `You are a content moderation classifier.
Analyze the following message and determine whether it contains sexual content.

Respond with STRICT JSON only, no markdown, no code fences, no extra text.
The JSON must have exactly this shape:
{"rank": "<one of: bad | kinda bad | okay | good | Unknown>", "comment": "<a short, warm, human comment about the thought itself>, "wantEdit": "<type why the story want to be edit>"}

Rank guidance:
- "bad" → 100% certain the message is sexual and the story is so bad, understandable and sexual content on it or Haram story or its a welcome message not a thought or a story about the user or feelings
- "kinda bad" → ~70% sure the message is sexual or the story|thought is understandable 
- "okay" → ~50% unsure or neutral or the story|thought is good but want more details on it 
- "good" → ~20% sure or confident it is NOT sexual and the story|thought is good and understandable
- "unknown" → cannot determine confidently

more guidance:
- must be a story not a welcome message or any other fancy thing and if it a welcome or anything u should say "bad"  cuz its should be a thought or a story not a welcoming message 
- must be understandable story , ppl can understand 

for comment string ( language : ${locale})
- must be a short message like u are a girl called Emma or أيما for the user who texted the thought or the story ( don't forget to make it normal short and not more than 5 words as much as u can)
- If the story is a single spam-like word or gibberish, rank should be "bad" and the comment can note that briefly. 
- If the story is sad or difficult, respond with something empathetic and more humans , talk like u are human and u wanna make your friend get better in short way like (im very sorry about what happened to you)
- If the story is funny or lighthearted, respond warmly like you are talking with a friend not like AI MODEL
- the story must be normal and not code or binnary system code or any other way , must be one thing a normal text with a clear story about user life or moment
- Keep the comment short — one sentence.
- and if it want to edit make it an empty string

for the wantEdit string ( language : ${locale})
- if the story isn't that understandable , ( im soo sad and i wanna die , i had a bad day today and i wasn't that happy )  
- if the story like a spam or copied story and no one would care about 
- and if its bad too 
- if the story no need to edit , just make it an empty string 
- tell the problem with the message|story|thought to the user and say what is the wrong

Message to analyze:${thought}
`,
      max_output_tokens: 100000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AI_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const messageBlock = response.data.output.find(
    (item: any) => item.type === "message",
  );
  const rawText: string = messageBlock?.content?.[0]?.text ?? "";

  try {
    // Strip any accidental code fences before parsing, just in case
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      rank: parsed.rank ?? "Unknown",
      comment: parsed.comment ?? "",
      wantEdit: parsed.wantEdit ?? "",
    };
  } catch {
    // If the model didn't return valid JSON, fail safe instead of crashing
    return { rank: "Unknown", comment: "", wantEdit: "" };
  }
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "Unknown";
    const body = await req.json();
    const { thought, locale } = body;

    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id)
      return NextResponse.json("Bad Credential", { status: 400 });
    if (!thought)
      return NextResponse.json("you should Type your Story", { status: 400 });
    if (!locale)
      return NextResponse.json("locale language not founded", { status: 400 });

    await connectDB();

    // just for finding out where is the Anonymous (Like : Egypt, Canada, USA and etc...)
    let country = "Unknown";
    if (ip !== "Unknown") {
      try {
        const res = await fetch(
          `${process.env.IP_LOCATION_LINK}${ip}?token=${process.env.IP_LOCATION_TOKEN}`,
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

    let rank = "Unknown";
    let comment = "";
    let wantEdit = "";

    try {
      const result = await classifyThought(thought, locale);
      rank = result.rank;
      comment = result.comment;
      wantEdit = result.wantEdit;
    } catch (err) {
      return NextResponse.json("Failed to fetch AI Response", {
        status: 400,
      });
    }

    const CreatedThought = await Thought.create({
      userId: session?.user.id,
      thought,
      country,
      rank, // only the rank is persisted
    });

    return NextResponse.json(
      {
        message: "Created Successfully",
        comment,
        wantEdit,
        thoughtId: CreatedThought._id,
      }, // comment goes back to the client, not the DB
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 },
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
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const session = await auth.api.getSession({ headers: await headers() });

    const { thought, thoughtId, locale } = body;

    if (!session) {
      return NextResponse.json("Bad Credential", { status: 400 });
    }

    if (!thoughtId) {
      return NextResponse.json("thought ID Not Found", { status: 401 });
    }
    if (!locale)
      return NextResponse.json("locale language not founded", { status: 400 });

    if (!thought) {
      return NextResponse.json(
        { error: "thought is required" },
        { status: 400 },
      );
    }
    await connectDB();

    let rank = "Unknown";
    let comment = "";
    let wantEdit = "";
    try {
      const result = await classifyThought(thought, locale);
      rank = result.rank;
      comment = result.comment;
      wantEdit = result.wantEdit;
    } catch (err) {
      return NextResponse.json("Failed to fetch AI Response", {
        status: 400,
      });
    }

    const findingThought = await Thought.findOne({ _id: thoughtId });
    if (thought.userId != session.user.id) {
      return NextResponse.json("thought isn't yours", { status: 400 });
    }

    if (!findingThought) {
      return NextResponse.json({ error: "Thought not found" }, { status: 404 });
    }

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        thought,
        rank,
      },
      { new: true },
    );

    return NextResponse.json(
      { updatedThought, thoughtId, comment, wantEdit },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { thoughtId } = body;

    if (!session) {
      return NextResponse.json({ error: "Bad Credential" }, { status: 401 });
    }

    if (!thoughtId) {
      return NextResponse.json(
        { error: "Thought ID not found" },
        { status: 400 },
      );
    }

    await connectDB();

    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return NextResponse.json({ error: "Thought not found" }, { status: 404 });
    }

    if (thought.userId !== session.user.id) {
      return NextResponse.json(
        { error: "This thought isn't yours" },
        { status: 403 },
      );
    }

    await Thought.findByIdAndDelete(thoughtId);

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (err as Error).message,
      },
      { status: 500 },
    );
  }
}
