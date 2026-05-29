import { Router } from "express";
import { z } from "zod";
import { create, index, show, update } from "../controllers/issues.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const statuses = ["watching", "researching", "coding", "pr_opened", "merged", "abandoned"];

router.use(requireAuth);
router.get("/", validate(z.object({ query: z.object({ status: z.enum(statuses).optional() }) })), index);
router.get("/:id", show);
router.post(
  "/",
  validate(
    z.object({
      body: z.object({
        repositoryId: z.string().min(1),
        issueNumber: z.coerce.number().int().positive()
      })
    })
  ),
  create
);
router.patch(
  "/:id",
  validate(z.object({ body: z.object({ contributionStatus: z.enum(statuses) }) })),
  update
);

export default router;
