import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true, index: true },
    githubUsername: { type: String, required: true, index: true },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshTokenVersion: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
