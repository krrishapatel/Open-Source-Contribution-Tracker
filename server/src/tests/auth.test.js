import request from "supertest";
import { describe, expect, it } from "vitest";
import { app, createTestUser } from "./testApp.js";

describe("auth", () => {
  it("rejects protected routes without a token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
  });

  it("returns the current user with a valid token", async () => {
    const { token } = await createTestUser();

    const response = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.githubUsername).toBe("octocat");
    expect(response.body.accessToken).toBeTruthy();
  });
});
