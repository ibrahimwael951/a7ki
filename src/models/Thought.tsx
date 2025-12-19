import mongoose from "mongoose";
const ThoughtSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  thought: { type: String, required: true },
  country: { type: String, required: true },
  rank: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Thought =
  mongoose.models.Thought || mongoose.model("Thought", ThoughtSchema);
