import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { seedDefaultHabitsForUser } from "../utils/seedDefaults.js";

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    preferredLang: user.preferredLang,
    defaultTargetScorePercent: user.defaultTargetScorePercent
  };
}

export async function register(req, res) {
  try {
    const { name, email, password, preferredLang } = req.body;

    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({
        message: "Name, valid email, and password (min 6 chars) are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      preferredLang: preferredLang === "en" ? "en" : "gu"
    });

    await seedDefaultHabitsForUser(user._id);

    const token = signToken(user._id);
    return res.status(201).json({ token, user: serializeUser(user) });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Failed to register user." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Ensure user has habits seeded if somehow empty
    await seedDefaultHabitsForUser(user._id);

    const token = signToken(user._id);
    return res.json({ token, user: serializeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Failed to sign in." });
  }
}

export async function getMe(req, res) {
  return res.json({ user: serializeUser(req.user) });
}

export async function updateProfile(req, res) {
  try {
    const { name, preferredLang, defaultTargetScorePercent } = req.body;
    const updates = {};

    if (typeof name === "string" && name.trim()) {
      updates.name = name.trim();
    }
    if (preferredLang === "gu" || preferredLang === "en") {
      updates.preferredLang = preferredLang;
    }
    if (typeof defaultTargetScorePercent === "number") {
      updates.defaultTargetScorePercent = Math.min(100, Math.max(1, defaultTargetScorePercent));
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    return res.json({ user: serializeUser(updated) });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Failed to update profile." });
  }
}
