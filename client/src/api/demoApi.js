const demoUser = {
  id: "demo-user",
  githubUsername: "learning-dev",
  displayName: "Learning Dev",
  avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4"
};

const initialState = {
  repositories: [
    {
      _id: "repo-react",
      fullName: "facebook/react",
      owner: "facebook",
      name: "react",
      description: "The library for web and native user interfaces.",
      language: "JavaScript",
      stars: 231000,
      forks: 47000,
      openIssues: 900,
      url: "https://github.com/facebook/react"
    },
    {
      _id: "repo-node",
      fullName: "nodejs/node",
      owner: "nodejs",
      name: "node",
      description: "Node.js JavaScript runtime.",
      language: "JavaScript",
      stars: 111000,
      forks: 31000,
      openIssues: 2200,
      url: "https://github.com/nodejs/node"
    }
  ],
  issues: [
    {
      _id: "issue-1",
      repository: {
        _id: "repo-react",
        fullName: "facebook/react"
      },
      number: 28791,
      title: "Improve docs for async rendering patterns",
      state: "open",
      labels: ["good first issue", "documentation"],
      contributionStatus: "researching",
      url: "https://github.com/facebook/react/issues/28791"
    }
  ],
  pullRequests: [
    {
      _id: "pr-1",
      repository: {
        _id: "repo-react",
        fullName: "facebook/react"
      },
      trackedIssue: "issue-1",
      number: 28802,
      title: "Clarify async rendering docs",
      state: "open",
      merged: false,
      url: "https://github.com/facebook/react/pull/28802"
    }
  ],
  notes: {
    "issue-1": [
      {
        _id: "note-1",
        body: "Read the issue thread. Need to inspect docs around useTransition and examples that mention async rendering.",
        createdAt: new Date().toISOString()
      }
    ]
  }
};

function readState() {
  const stored = localStorage.getItem("demoState");
  if (!stored) {
    localStorage.setItem("demoState", JSON.stringify(initialState));
    return structuredClone(initialState);
  }

  return JSON.parse(stored);
}

function writeState(state) {
  localStorage.setItem("demoState", JSON.stringify(state));
}

function stats(state) {
  return {
    repositories: state.repositories.length,
    issues: state.issues.length,
    prs: state.pullRequests.length,
    mergedPrs: state.pullRequests.filter((pr) => pr.merged).length,
    statusBreakdown: []
  };
}

export async function demoApi(path, options = {}) {
  const method = options.method ?? "GET";
  const body = options.body ? JSON.parse(options.body) : {};
  const state = readState();

  if (path === "/api/auth/me" || path === "/api/auth/refresh") {
    return { user: demoUser, accessToken: "demo-token" };
  }

  if (path === "/api/auth/logout") {
    return null;
  }

  if (path === "/api/dashboard") {
    return { stats: stats(state) };
  }

  if (path === "/api/repos" && method === "GET") {
    return { repositories: state.repositories };
  }

  if (path === "/api/repos" && method === "POST") {
    const [owner, name] = body.fullName.split("/");
    const repository = {
      _id: `repo-${Date.now()}`,
      fullName: body.fullName,
      owner,
      name,
      description: "Demo repository. Real mode pulls this from GitHub.",
      language: "Unknown",
      stars: 0,
      forks: 0,
      openIssues: 0,
      url: `https://github.com/${body.fullName}`
    };
    state.repositories.unshift(repository);
    writeState(state);
    return { repository };
  }

  if (path === "/api/issues" && method === "GET") {
    return { issues: state.issues };
  }

  if (path === "/api/issues" && method === "POST") {
    const repository = state.repositories.find((repo) => repo._id === body.repositoryId);
    const issue = {
      _id: `issue-${Date.now()}`,
      repository: { _id: repository._id, fullName: repository.fullName },
      number: body.issueNumber,
      title: "Demo tracked issue. Real mode pulls the title from GitHub.",
      state: "open",
      labels: [],
      contributionStatus: "watching",
      url: `${repository.url}/issues/${body.issueNumber}`
    };
    state.issues.unshift(issue);
    state.notes[issue._id] = [];
    writeState(state);
    return { issue };
  }

  if (path.startsWith("/api/issues/") && method === "PATCH") {
    const id = path.split("/").at(-1);
    const issue = state.issues.find((item) => item._id === id);
    issue.contributionStatus = body.contributionStatus;
    writeState(state);
    return { issue };
  }

  if (path.startsWith("/api/issues/") && method === "GET") {
    const id = path.split("/").at(-1);
    const issue = state.issues.find((item) => item._id === id);
    const pullRequests = state.pullRequests.filter((pr) => pr.trackedIssue === id);
    return { issue, notes: state.notes[id] ?? [], pullRequests };
  }

  if (path === "/api/pull-requests" && method === "GET") {
    return { pullRequests: state.pullRequests };
  }

  if (path === "/api/pull-requests" && method === "POST") {
    const repository = state.repositories.find((repo) => repo._id === body.repositoryId);
    const pullRequest = {
      _id: `pr-${Date.now()}`,
      repository: { _id: repository._id, fullName: repository.fullName },
      trackedIssue: body.trackedIssueId,
      number: body.prNumber,
      title: "Demo tracked PR. Real mode pulls the title from GitHub.",
      state: "open",
      merged: false,
      url: `${repository.url}/pull/${body.prNumber}`
    };
    state.pullRequests.unshift(pullRequest);
    writeState(state);
    return { pullRequest };
  }

  if (path === "/api/notes" && method === "POST") {
    const note = {
      _id: `note-${Date.now()}`,
      body: body.body,
      createdAt: new Date().toISOString()
    };
    state.notes[body.trackedIssueId] = [note, ...(state.notes[body.trackedIssueId] ?? [])];
    writeState(state);
    return { note };
  }

  throw new Error(`Demo API route not implemented: ${method} ${path}`);
}

export function startDemoSession() {
  localStorage.setItem("accessToken", "demo-token");
  localStorage.setItem("user", JSON.stringify(demoUser));
  if (!localStorage.getItem("demoState")) {
    localStorage.setItem("demoState", JSON.stringify(initialState));
  }
  return { user: demoUser, accessToken: "demo-token" };
}
