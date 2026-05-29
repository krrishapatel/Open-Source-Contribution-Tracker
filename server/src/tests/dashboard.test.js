import request from "supertest";
import { describe, expect, it } from "vitest";
import { PullRequest } from "../models/PullRequest.js";
import { Repository } from "../models/Repository.js";
import { TrackedIssue } from "../models/TrackedIssue.js";
import { app, createTestUser } from "./testApp.js";

describe("dashboard", () => {
  it("summarizes the user's contribution stats", async () => {
    const { user, token } = await createTestUser();
    const repository = await Repository.create({
      user: user.id,
      githubRepoId: 1,
      owner: "facebook",
      name: "react",
      fullName: "facebook/react",
      url: "https://github.com/facebook/react"
    });
    const issue = await TrackedIssue.create({
      user: user.id,
      repository: repository.id,
      githubIssueId: 2,
      number: 42,
      title: "Improve docs",
      url: "https://github.com/facebook/react/issues/42",
      contributionStatus: "coding"
    });
    await PullRequest.create({
      user: user.id,
      repository: repository.id,
      trackedIssue: issue.id,
      githubPullRequestId: 3,
      number: 43,
      title: "Docs fix",
      url: "https://github.com/facebook/react/pull/43",
      merged: true,
      state: "closed"
    });

    const response = await request(app).get("/api/dashboard").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.stats.repositories).toBe(1);
    expect(response.body.stats.issues).toBe(1);
    expect(response.body.stats.prs).toBe(1);
    expect(response.body.stats.mergedPrs).toBe(1);
  });
});
