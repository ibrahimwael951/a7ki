import mongoose, { Schema, Model } from "mongoose";

const UserSchema = new Schema(
  {
    email: String,
    name: String,
    image: String,
    createdAt: Date,
    isAnonymous: Boolean,
    emailVerified: Boolean,
    banned: Boolean,
    role: String,
  },
  {
    collection: "user",
  },
);
export const user: Model<any> =
  mongoose.models.user || mongoose.model("user", UserSchema);
