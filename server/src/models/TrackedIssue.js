import mongoose from "mongoose";

const trackedIssueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    repository: { type: mongoose.Schema.Types.ObjectId, ref: "Repository", required: true },
    githubIssueId: { type: Number, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    bodyPreview: { type: String, default: "" },
    state: { type: String, enum: ["open", "closed"], default: "open" },
    labels: [{ type: String }],
    assignees: [{ type: String }],
    url: { type: String, required: true },
    contributionStatus: {
      type: String,
      enum: ["watching", "researching", "coding", "pr_opened", "merged", "abandoned"],
      default: "watching"
    },
    lastGithubUpdateAt: { type: Date },
    lastSyncedAt: { type: Date }
  },
  { timestamps: true }
);

trackedIssueSchema.index({ user: 1, repository: 1, number: 1 }, { unique: true });

export const TrackedIssue = mongoose.model("TrackedIssue", trackedIssueSchema);
