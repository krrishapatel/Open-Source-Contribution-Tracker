import { Router } from "express";
import { show } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", requireAuth, show);

export default router;
