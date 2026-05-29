import mongoose from "mongoose";

const pullRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    repository: { type: mongoose.Schema.Types.ObjectId, ref: "Repository", required: true },
    trackedIssue: { type: mongoose.Schema.Types.ObjectId, ref: "TrackedIssue" },
    githubPullRequestId: { type: Number, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    state: { type: String, enum: ["open", "closed"], default: "open" },
    merged: { type: Boolean, default: false },
    url: { type: String, required: true },
    lastGithubUpdateAt: { type: Date },
    lastSyncedAt: { type: Date }
  },
  { timestamps: true }
);

pullRequestSchema.index({ user: 1, repository: 1, number: 1 }, { unique: true });

export const PullRequest = mongoose.model("PullRequest", pullRequestSchema);
