import { Router } from "express";
import { githubCallback, githubLogin, logout, me, refresh } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

export default router;
