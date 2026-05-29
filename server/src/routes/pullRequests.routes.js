import { Router } from "express";
import { z } from "zod";
import { create, index } from "../controllers/pullRequests.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(requireAuth);
router.get("/", index);
router.post(
  "/",
  validate(
    z.object({
      body: z.object({
        repositoryId: z.string().min(1),
        prNumber: z.coerce.number().int().positive(),
        trackedIssueId: z.string().optional()
      })
    })
  ),
  create
);

export default router;
