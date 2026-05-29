import { PullRequest } from "../models/PullRequest.js";
import { Repository } from "../models/Repository.js";
import { TrackedIssue } from "../models/TrackedIssue.js";
import { notFound } from "../utils/errors.js";
import { getPullRequestFromGithub } from "./github.service.js";

export async function listPullRequests(user) {
  return PullRequest.find({ user: user.id }).populate("repository trackedIssue").sort({ updatedAt: -1 });
}

export async function trackPullRequest(user, repositoryId, prNumber, trackedIssueId) {
  const repository = await Repository.findOne({ _id: repositoryId, user: user.id });
  if (!repository) {
    throw notFound("Repository not found");
  }

  let trackedIssue = null;
  if (trackedIssueId) {
    trackedIssue = await TrackedIssue.findOne({ _id: trackedIssueId, user: user.id });
    if (!trackedIssue) {
      throw notFound("Tracked issue not found");
    }
  }

  const prData = await getPullRequestFromGithub(user, repository, prNumber);

  const pullRequest = await PullRequest.findOneAndUpdate(
    { user: user.id, repository: repository.id, number: prData.number },
    { ...prData, user: user.id, repository: repository.id, trackedIssue: trackedIssue?.id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate("repository trackedIssue");

  if (trackedIssue && pullRequest.merged) {
    trackedIssue.contributionStatus = "merged";
    await trackedIssue.save();
  }

  return pullRequest;
}
