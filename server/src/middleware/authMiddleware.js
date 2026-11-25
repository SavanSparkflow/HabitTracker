import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * Verifies Bearer JWT token and attaches req.user.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const token = authHeader.slice(7).trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
