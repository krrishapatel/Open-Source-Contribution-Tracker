import { useState } from "react";
import { Plus } from "lucide-react";
import { FormField } from "../../components/FormField.jsx";
import { api } from "../../api/http.js";
import { NotesPanel } from "../notes/NotesPanel.jsx";

const statuses = ["watching", "researching", "coding", "pr_opened", "merged", "abandoned"];

export function IssueTracker({ repositories, issues, onChange }) {
  const [repositoryId, setRepositoryId] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    await api("/api/issues", {
      method: "POST",
      body: JSON.stringify({ repositoryId, issueNumber: Number(issueNumber) })
    });
    setIssueNumber("");
    await onChange();
  }

  async function updateStatus(issueId, contributionStatus) {
    await api(`/api/issues/${issueId}`, {
      method: "PATCH",
      body: JSON.stringify({ contributionStatus })
    });
    await onChange();
  }

  return (
    <section className="section" id="issues">
      <div className="section-header">
        <h2>Issues</h2>
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
          <FormField label="issue #">
            <input
              type="number"
              min="1"
              value={issueNumber}
              onChange={(event) => setIssueNumber(event.target.value)}
              required
            />
          </FormField>
          <button className="icon-button filled" aria-label="Track issue" title="Track issue">
            <Plus size={18} />
          </button>
        </form>
      </div>
      <div className="issue-list">
        {issues.map((issue) => (
          <article className="list-card issue-card" key={issue._id}>
            <div>
              <a href={issue.url} target="_blank" rel="noreferrer">
                #{issue.number} {issue.title}
              </a>
              <p>{issue.repository?.fullName}</p>
            </div>
            <select
              value={issue.contributionStatus}
              onChange={(event) => updateStatus(issue._id, event.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
            <button className="text-button" onClick={() => setSelectedIssue(issue)}>
              Notes
            </button>
          </article>
        ))}
      </div>
      {selectedIssue ? (
        <NotesPanel issue={selectedIssue} onClose={() => setSelectedIssue(null)} onChange={onChange} />
      ) : null}
    </section>
  );
}
