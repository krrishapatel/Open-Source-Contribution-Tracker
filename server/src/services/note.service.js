import { Note } from "../models/Note.js";
import { TrackedIssue } from "../models/TrackedIssue.js";
import { notFound } from "../utils/errors.js";

export async function createNote(user, trackedIssueId, body) {
  const issue = await TrackedIssue.findOne({ _id: trackedIssueId, user: user.id });
  if (!issue) {
    throw notFound("Tracked issue not found");
  }

  return Note.create({ user: user.id, trackedIssue: issue.id, body });
}

export async function deleteNote(user, noteId) {
  const note = await Note.findOneAndDelete({ _id: noteId, user: user.id });
  if (!note) {
    throw notFound("Note not found");
  }
}
