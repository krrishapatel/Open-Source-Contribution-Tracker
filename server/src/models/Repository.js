import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    githubRepoId: { type: Number, required: true },
    owner: { type: String, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    description: { type: String, default: "" },
    language: { type: String, default: "" },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    openIssues: { type: Number, default: 0 },
    url: { type: String, required: true },
    isArchived: { type: Boolean, default: false },
    lastSyncedAt: { type: Date }
  },
  { timestamps: true }
);

repositorySchema.index({ user: 1, fullName: 1 }, { unique: true });

export const Repository = mongoose.model("Repository", repositorySchema);
