import { Note } from "../models/Note.js";
import { PullRequest } from "../models/PullRequest.js";
import { Repository } from "../models/Repository.js";
import { TrackedIssue } from "../models/TrackedIssue.js";
import { notFound } from "../utils/errors.js";
import { getIssueFromGithub } from "./github.service.js";

export async function listIssues(user, filters = {}) {
  const query = { user: user.id };

  if (filters.status) {
    query.contributionStatus = filters.status;
  }

  return TrackedIssue.find(query).populate("repository").sort({ updatedAt: -1 });
}

export async function trackIssue(user, repositoryId, issueNumber) {
  const repository = await Repository.findOne({ _id: repositoryId, user: user.id });
  if (!repository) {
    throw notFound("Repository not found");
  }

  const issueData = await getIssueFromGithub(user, repository, issueNumber);

  return TrackedIssue.findOneAndUpdate(
    { user: user.id, repository: repository.id, number: issueData.number },
    { ...issueData, user: user.id, repository: repository.id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate("repository");
}

export async function updateIssueStatus(user, issueId, contributionStatus) {
  const issue = await TrackedIssue.findOneAndUpdate(
    { _id: issueId, user: user.id },
    { contributionStatus },
    { new: true }
  ).populate("repository");

  if (!issue) {
    throw notFound("Tracked issue not found");
  }

  return issue;
}

export async function getIssueDetails(user, issueId) {
  const issue = await TrackedIssue.findOne({ _id: issueId, user: user.id }).populate("repository");
  if (!issue) {
    throw notFound("Tracked issue not found");
  }

  const [notes, pullRequests] = await Promise.all([
    Note.find({ user: user.id, trackedIssue: issue.id }).sort({ createdAt: -1 }),
    PullRequest.find({ user: user.id, trackedIssue: issue.id }).sort({ updatedAt: -1 })
  ]);

  return { issue, notes, pullRequests };
}
