import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(configDir, "../../.env") });

function readSecret(name) {
  const value = process.env[name] ?? "";
  return value.startsWith("replace-me") ? "" : value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5001),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  mongoUri: process.env.MONGO_URI ?? "mongodb://localhost:27017/contrib_tracker",
  jwtAccessSecret: readSecret("JWT_ACCESS_SECRET") || "dev-access-secret",
  jwtRefreshSecret: readSecret("JWT_REFRESH_SECRET") || "dev-refresh-secret",
  githubClientId: readSecret("GITHUB_CLIENT_ID"),
  githubClientSecret: readSecret("GITHUB_CLIENT_SECRET")
};
