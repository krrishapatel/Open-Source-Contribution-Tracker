import { Octokit } from "@octokit/rest";

export function createGithubClient(user) {
  return new Octokit({ auth: user.accessToken });
}

export function parseRepoFullName(fullName) {
  const [owner, name] = fullName.split("/");
  if (!owner || !name) {
    const error = new Error("Repository must be formatted as owner/name");
    error.statusCode = 400;
    throw error;
  }
  return { owner, name };
}

export async function getRepositoryFromGithub(user, fullName) {
  const github = createGithubClient(user);
  const { owner, name } = parseRepoFullName(fullName);
  const { data } = await github.repos.get({ owner, repo: name });

  return {
    githubRepoId: data.id,
    owner: data.owner.login,
    name: data.name,
    fullName: data.full_name,
    description: data.description ?? "",
    language: data.language ?? "",
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    url: data.html_url,
    isArchived: data.archived,
    lastSyncedAt: new Date()
  };
}

export async function getIssueFromGithub(user, repository, issueNumber) {
  const github = createGithubClient(user);
  const { data } = await github.issues.get({
    owner: repository.owner,
    repo: repository.name,
    issue_number: issueNumber
  });

  return {
    githubIssueId: data.id,
    number: data.number,
    title: data.title,
    bodyPreview: (data.body ?? "").slice(0, 260),
    state: data.state,
    labels: data.labels.map((label) => (typeof label === "string" ? label : label.name)),
    assignees: data.assignees?.map((assignee) => assignee.login) ?? [],
    url: data.html_url,
    lastGithubUpdateAt: data.updated_at ? new Date(data.updated_at) : undefined,
    lastSyncedAt: new Date()
  };
}

export async function getPullRequestFromGithub(user, repository, prNumber) {
  const github = createGithubClient(user);
  const { data } = await github.pulls.get({
    owner: repository.owner,
    repo: repository.name,
    pull_number: prNumber
  });

  return {
    githubPullRequestId: data.id,
    number: data.number,
    title: data.title,
    state: data.state,
    merged: Boolean(data.merged_at),
    url: data.html_url,
    lastGithubUpdateAt: data.updated_at ? new Date(data.updated_at) : undefined,
    lastSyncedAt: new Date()
  };
}
