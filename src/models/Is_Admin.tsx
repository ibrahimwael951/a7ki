import mongoose from "mongoose";

const IsAdminSchema = new mongoose.Schema({
  userId: { type: String, required: true },
});

export const is_admin =
  mongoose.models.is_admin || mongoose.model("is_admin", IsAdminSchema);
