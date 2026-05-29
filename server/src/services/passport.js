import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export function configurePassport() {
  if (!env.githubClientId || !env.githubClientSecret) {
    return;
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID: env.githubClientId,
        clientSecret: env.githubClientSecret,
        callbackURL: "/api/auth/github/callback",
        scope: ["read:user", "repo"]
      },
      async (accessToken, _refreshToken, profile, done) => {
        try {
          const user = await User.findOneAndUpdate(
            { githubId: profile.id },
            {
              githubId: profile.id,
              githubUsername: profile.username,
              displayName: profile.displayName || profile.username,
              avatarUrl: profile.photos?.[0]?.value ?? "",
              accessToken
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
