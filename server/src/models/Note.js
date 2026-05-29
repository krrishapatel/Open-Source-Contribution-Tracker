import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    trackedIssue: { type: mongoose.Schema.Types.ObjectId, ref: "TrackedIssue", required: true },
    body: { type: String, required: true, maxlength: 4000 }
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
