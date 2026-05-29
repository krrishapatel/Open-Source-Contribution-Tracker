import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { configurePassport } from "./services/passport.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import issueRoutes from "./routes/issues.routes.js";
import noteRoutes from "./routes/notes.routes.js";
import prRoutes from "./routes/pullRequests.routes.js";
import repoRoutes from "./routes/repos.routes.js";

export function createApp() {
  const app = express();

  configurePassport();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(passport.initialize());

  if (env.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/repos", repoRoutes);
  app.use("/api/issues", issueRoutes);
  app.use("/api/pull-requests", prRoutes);
  app.use("/api/notes", noteRoutes);
  app.use(errorHandler);

  return app;
}
