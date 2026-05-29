import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/tokens.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      const error = new Error("Missing auth token");
      error.statusCode = 401;
      throw error;
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      const error = new Error("User no longer exists");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch {
    const error = new Error("Invalid or expired auth token");
    error.statusCode = 401;
    next(error);
  }
}
