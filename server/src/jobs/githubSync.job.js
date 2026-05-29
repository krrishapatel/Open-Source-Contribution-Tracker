import cron from "node-cron";
import { PullRequest } from "../models/PullRequest.js";
import { Repository } from "../models/Repository.js";
import { TrackedIssue } from "../models/TrackedIssue.js";
import { User } from "../models/User.js";
import {
  getIssueFromGithub,
  getPullRequestFromGithub,
  getRepositoryFromGithub
} from "../services/github.service.js";

async function syncUser(user) {
  const repositories = await Repository.find({ user: user.id });

  for (const repository of repositories) {
    const repoData = await getRepositoryFromGithub(user, repository.fullName);
    await repository.set(repoData).save();

    const issues = await TrackedIssue.find({ user: user.id, repository: repository.id });
    for (const issue of issues) {
      const issueData = await getIssueFromGithub(user, repository, issue.number);
      await issue.set(issueData).save();
    }

    const pullRequests = await PullRequest.find({ user: user.id, repository: repository.id });
    for (const pullRequest of pullRequests) {
      const prData = await getPullRequestFromGithub(user, repository, pullRequest.number);
      await pullRequest.set(prData).save();
    }
  }
}

export async function runGithubSync() {
  const users = await User.find({});
  for (const user of users) {
    try {
      await syncUser(user);
    } catch (error) {
      console.error(`GitHub sync failed for ${user.githubUsername}`, error.message);
    }
  }
}

export function startGithubSyncJob() {
  cron.schedule("*/30 * * * *", runGithubSync);
}
