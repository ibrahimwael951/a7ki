import mongoose from "mongoose";

const ThoughtViewSchema = new mongoose.Schema({
  thoughtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thought",
    required: true,
  },
  viewerId: { type: String, required: true },
  lastViewedAt: { type: Date, required: true, default: Date.now },
});

ThoughtViewSchema.index({ thoughtId: 1, viewerId: 1 }, { unique: true });

export const ThoughtView =
  mongoose.models.ThoughtView ||
  mongoose.model("ThoughtView", ThoughtViewSchema);