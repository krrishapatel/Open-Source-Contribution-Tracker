import { listPullRequests, trackPullRequest } from "../services/pullRequest.service.js";

export async function index(req, res, next) {
  try {
    res.json({ pullRequests: await listPullRequests(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const pullRequest = await trackPullRequest(
      req.user,
      req.validated.body.repositoryId,
      req.validated.body.prNumber,
      req.validated.body.trackedIssueId
    );
    res.status(201).json({ pullRequest });
  } catch (error) {
    next(error);
  }
}
