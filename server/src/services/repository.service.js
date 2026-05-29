import { Repository } from "../models/Repository.js";
import { getRepositoryFromGithub } from "./github.service.js";

export async function listRepositories(user) {
  return Repository.find({ user: user.id }).sort({ updatedAt: -1 });
}

export async function saveRepository(user, fullName) {
  const repoData = await getRepositoryFromGithub(user, fullName);

  return Repository.findOneAndUpdate(
    { user: user.id, fullName: repoData.fullName },
    { ...repoData, user: user.id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
