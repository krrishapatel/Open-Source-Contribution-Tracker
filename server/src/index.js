import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { startGithubSyncJob } from "./jobs/githubSync.job.js";

await connectDb();

const app = createApp();

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

startGithubSyncJob();
