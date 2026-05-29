import { Router } from "express";
import { z } from "zod";
import { create, index } from "../controllers/repos.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(requireAuth);
router.get("/", index);
router.post(
  "/",
  validate(z.object({ body: z.object({ fullName: z.string().regex(/^[^/]+\/[^/]+$/) }) })),
  create
);

export default router;
