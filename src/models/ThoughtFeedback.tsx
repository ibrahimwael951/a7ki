import mongoose from "mongoose";
const ThoughtFeedbackSchema = new mongoose.Schema(
  {
    thoughtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thoughts",
      required: true,
    },
    AdminName: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export const ThoughtFeedback =
  mongoose.models.ThoughtFeedback ||
  mongoose.model("ThoughtFeedback", ThoughtFeedbackSchema);
