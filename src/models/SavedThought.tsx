import mongoose from "mongoose";

const SavedThoughtSchema = new mongoose.Schema(
  {
    thoughtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thought",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const SavedThought =
  mongoose.models.SavedThought ||
  mongoose.model("SavedThought", SavedThoughtSchema);
