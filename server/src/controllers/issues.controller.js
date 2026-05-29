import { getIssueDetails, listIssues, trackIssue, updateIssueStatus } from "../services/issue.service.js";

export async function index(req, res, next) {
  try {
    const issues = await listIssues(req.user, req.validated?.query ?? {});
    res.json({ issues });
  } catch (error) {
    next(error);
  }
}

export async function show(req, res, next) {
  try {
    res.json(await getIssueDetails(req.user, req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const issue = await trackIssue(
      req.user,
      req.validated.body.repositoryId,
      req.validated.body.issueNumber
    );
    res.status(201).json({ issue });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const issue = await updateIssueStatus(
      req.user,
      req.params.id,
      req.validated.body.contributionStatus
    );
    res.json({ issue });
  } catch (error) {
    next(error);
  }
}
