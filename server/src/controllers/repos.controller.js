import { listRepositories, saveRepository } from "../services/repository.service.js";

export async function index(req, res, next) {
  try {
    res.json({ repositories: await listRepositories(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const repository = await saveRepository(req.user, req.validated.body.fullName);
    res.status(201).json({ repository });
  } catch (error) {
    next(error);
  }
}
