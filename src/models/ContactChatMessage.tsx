import mongoose from "mongoose";

const ContactChatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String },
  senderRole: { type: String, enum: ["user", "admin"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ContactChatMessage =
  mongoose.models.ContactChatMessage ||
  mongoose.model("ContactChatMessage", ContactChatMessageSchema);
