import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api } from "../../api/http.js";

export function NotesPanel({ issue, onClose, onChange }) {
  const [details, setDetails] = useState(null);
  const [body, setBody] = useState("");

  useEffect(() => {
    api(`/api/issues/${issue._id}`).then(setDetails);
  }, [issue._id]);

  async function addNote(event) {
    event.preventDefault();
    await api("/api/notes", {
      method: "POST",
      body: JSON.stringify({ trackedIssueId: issue._id, body })
    });
    setBody("");
    const nextDetails = await api(`/api/issues/${issue._id}`);
    setDetails(nextDetails);
    await onChange();
  }

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Issue notes">
      <div className="drawer-header">
        <div>
          <span className="eyebrow">Research notes</span>
          <h3>#{issue.number} {issue.title}</h3>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close notes" title="Close notes">
          <X size={18} />
        </button>
      </div>
      <form onSubmit={addNote} className="note-form">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="What did you learn? What files might need changing?"
          required
        />
        <button className="primary-button">Add note</button>
      </form>
      <div className="notes-list">
        {details?.notes?.map((note) => (
          <article className="note-card" key={note._id}>
            <p>{note.body}</p>
            <time>{new Date(note.createdAt).toLocaleString()}</time>
          </article>
        ))}
      </div>
    </div>
  );
}
