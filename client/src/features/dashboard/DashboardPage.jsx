import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell.jsx";
import { StatCard } from "../../components/StatCard.jsx";
import { api } from "../../api/http.js";
import { IssueTracker } from "../issues/IssueTracker.jsx";
import { PullRequestTracker } from "../issues/PullRequestTracker.jsx";
import { RepositoryManager } from "../repos/RepositoryManager.jsx";

export function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [issues, setIssues] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [dashboardData, repoData, issueData, prData] = await Promise.all([
        api("/api/dashboard"),
        api("/api/repos"),
        api("/api/issues"),
        api("/api/pull-requests")
      ]);
      setDashboard(dashboardData.stats);
      setRepositories(repoData.repositories);
      setIssues(issueData.issues);
      setPullRequests(prData.pullRequests);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppShell>
      <header className="page-header" id="overview">
        <div>
          <span className="eyebrow">Contribution cockpit</span>
          <h1>Track the work that gets you merged</h1>
        </div>
      </header>

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="stats-grid">
        <StatCard label="Saved repos" value={dashboard?.repositories ?? 0} />
        <StatCard label="Tracked issues" value={dashboard?.issues ?? 0} />
        <StatCard label="Tracked PRs" value={dashboard?.prs ?? 0} />
        <StatCard label="Merged PRs" value={dashboard?.mergedPrs ?? 0} />
      </section>

      <RepositoryManager repositories={repositories} onChange={loadData} />
      <IssueTracker repositories={repositories} issues={issues} onChange={loadData} />
      <PullRequestTracker
        repositories={repositories}
        issues={issues}
        pullRequests={pullRequests}
        onChange={loadData}
      />
    </AppShell>
  );
}
