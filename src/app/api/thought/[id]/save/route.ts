import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import { Thought } from "@/models/Thought";
import { SavedThought } from "@/models/SavedThought";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Thought ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const thought = await Thought.findById(id);

    if (!thought) {
      return NextResponse.json({ error: "Thought not found" }, { status: 404 });
    }

    const existingSavedThought = await SavedThought.findOne({
      thoughtId: thought._id,
      userId: session.user.id,
    });

    if (existingSavedThought) {
      try {
        await SavedThought.deleteOne({ _id: existingSavedThought._id });
        return NextResponse.json(
          { message: "Thought unsaved successfully" },
          { status: 200 },
        );
      } catch (error) {
        console.error("Error unsaving thought:", error);
        return NextResponse.json(
          { error: "An error occurred while unsaving the thought." },
          { status: 500 },
        );
      }
    } else {
      const newSavedThought = new SavedThought({
        thoughtId: thought._id,
        userId: session.user.id,
      });
      await newSavedThought.save();
      return NextResponse.json(
        { message: "Thought saved successfully" },
        { status: 200 },
      );
    }
    
  } catch (error) {
    console.error("Error saving thought:", error);
    return NextResponse.json(
      { error: "An error occurred while saving the thought." },
      { status: 500 },
    );
  }
}
