import { useState } from "react";
import { Plus } from "lucide-react";
import { FormField } from "../../components/FormField.jsx";
import { api } from "../../api/http.js";

export function RepositoryManager({ repositories, onChange }) {
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await api("/api/repos", {
        method: "POST",
        body: JSON.stringify({ fullName })
      });
      setFullName("");
      await onChange();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="section" id="repositories">
      <div className="section-header">
        <h2>Repositories</h2>
        <form className="inline-form" onSubmit={handleSubmit}>
          <FormField label="owner/name">
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="facebook/react"
              required
            />
          </FormField>
          <button className="icon-button filled" disabled={isSaving} aria-label="Save repository" title="Save repository">
            <Plus size={18} />
          </button>
        </form>
      </div>
      <div className="item-grid">
        {repositories.map((repo) => (
          <article className="list-card" key={repo._id}>
            <a href={repo.url} target="_blank" rel="noreferrer">
              {repo.fullName}
            </a>
            <p>{repo.description || "No description yet."}</p>
            <div className="meta-row">
              <span>{repo.language || "Unknown"}</span>
              <span>{repo.stars} stars</span>
              <span>{repo.openIssues} open issues</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
