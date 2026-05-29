import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { createApp } from "../app.js";
import { User } from "../models/User.js";
import { signAccessToken } from "../utils/tokens.js";

let mongo;

export const app = createApp();

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ instance: { ip: "127.0.0.1" } });
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

export async function createTestUser() {
  const user = await User.create({
    githubId: "123",
    githubUsername: "octocat",
    displayName: "Octocat",
    avatarUrl: "https://github.com/images/error/octocat_happy.gif",
    accessToken: "fake-token"
  });

  return { user, token: signAccessToken(user) };
}
