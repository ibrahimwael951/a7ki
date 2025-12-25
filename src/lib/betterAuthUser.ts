import mongoose from "mongoose";

const AnySchema = new mongoose.Schema({}, { strict: false });

export const BetterAuthUser =
  mongoose.models.BetterAuthUser ||
  mongoose.model(
    "BetterAuthUser",
    AnySchema,
    "user" 
  );
