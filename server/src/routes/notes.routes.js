import { Router } from "express";
import { z } from "zod";
import { create, destroy } from "../controllers/notes.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(requireAuth);
router.post(
  "/",
  validate(
    z.object({
      body: z.object({
        trackedIssueId: z.string().min(1),
        body: z.string().min(1).max(4000)
      })
    })
  ),
  create
);
router.delete("/:id", destroy);

export default router;
