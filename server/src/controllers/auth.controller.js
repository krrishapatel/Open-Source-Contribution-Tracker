import passport from "passport";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

function authPayload(user) {
  return {
    user: {
      id: user.id,
      githubUsername: user.githubUsername,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    },
    accessToken: signAccessToken(user)
  };
}

export function githubLogin(req, res, next) {
  if (!env.githubClientId || !env.githubClientSecret) {
    res.status(503).json({ error: { message: "GitHub OAuth is not configured" } });
    return;
  }

  passport.authenticate("github")(req, res, next);
}

export function githubCallback(req, res, next) {
  passport.authenticate("github", { session: false }, (error, user) => {
    if (error || !user) {
      next(error ?? new Error("GitHub authentication failed"));
      return;
    }

    const refreshToken = signRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.nodeEnv === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = signAccessToken(user);
    res.redirect(`${env.clientUrl}/auth/callback?token=${accessToken}`);
  })(req, res, next);
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      const error = new Error("Missing refresh token");
      error.statusCode = 401;
      throw error;
    }

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json(authPayload(req.user));
}

export function logout(_req, res) {
  res.clearCookie("refreshToken");
  res.status(204).end();
}
