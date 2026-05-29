import { PullRequest } from "../models/PullRequest.js";
import { Repository } from "../models/Repository.js";
import { TrackedIssue } from "../models/TrackedIssue.js";

export async function show(req, res, next) {
  try {
    const [repositories, issues, prs, mergedPrs] = await Promise.all([
      Repository.countDocuments({ user: req.user.id }),
      TrackedIssue.countDocuments({ user: req.user.id }),
      PullRequest.countDocuments({ user: req.user.id }),
      PullRequest.countDocuments({ user: req.user.id, merged: true })
    ]);

    const statusBreakdown = await TrackedIssue.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$contributionStatus", count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        repositories,
        issues,
        prs,
        mergedPrs,
        statusBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
}
