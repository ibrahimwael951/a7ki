import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },  
);

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
