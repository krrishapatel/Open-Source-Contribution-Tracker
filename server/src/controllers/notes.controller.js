import { createNote, deleteNote } from "../services/note.service.js";

export async function create(req, res, next) {
  try {
    const note = await createNote(req.user, req.validated.body.trackedIssueId, req.validated.body.body);
    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    await deleteNote(req.user, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
