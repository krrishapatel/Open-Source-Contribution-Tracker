import { useState } from "react";
import { Plus } from "lucide-react";
import { FormField } from "../../components/FormField.jsx";
import { api } from "../../api/http.js";

export function PullRequestTracker({ repositories, issues, pullRequests, onChange }) {
  const [repositoryId, setRepositoryId] = useState("");
  const [trackedIssueId, setTrackedIssueId] = useState("");
  const [prNumber, setPrNumber] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await api("/api/pull-requests", {
      method: "POST",
      body: JSON.stringify({
        repositoryId,
        prNumber: Number(prNumber),
        trackedIssueId: trackedIssueId || undefined
      })
    });
    setPrNumber("");
    await onChange();
  }

  return (
    <section className="section" id="pull-requests">
      <div className="section-header">
        <h2>Pull requests</h2>
        <form className="inline-form" onSubmit={handleSubmit}>
          <FormField label="repo">
            <select value={repositoryId} onChange={(event) => setRepositoryId(event.target.value)} required>
              <option value="">Select repo</option>
              {repositories.map((repo) => (
                <option key={repo._id} value={repo._id}>
                  {repo.fullName}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="issue">
            <select value={trackedIssueId} onChange={(event) => setTrackedIssueId(event.target.value)}>
              <option value="">No linked issue</option>
              {issues.map((issue) => (
                <option key={issue._id} value={issue._id}>
                  #{issue.number} {issue.title}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="PR #">
            <input
              type="number"
              min="1"
              value={prNumber}
              onChange={(event) => setPrNumber(event.target.value)}
              required
            />
          </FormField>
          <button className="icon-button filled" aria-label="Track pull request" title="Track pull request">
            <Plus size={18} />
          </button>
        </form>
      </div>
      <div className="item-grid">
        {pullRequests.map((pr) => (
          <article className="list-card" key={pr._id}>
            <a href={pr.url} target="_blank" rel="noreferrer">
              #{pr.number} {pr.title}
            </a>
            <p>{pr.repository?.fullName}</p>
            <div className="meta-row">
              <span>{pr.state}</span>
              <span>{pr.merged ? "merged" : "not merged"}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
