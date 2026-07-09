import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/db";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// ─── REGISTER — instantly creates account and logs in ───────────
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    // ── Email format validation ──────────────────────────────────
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Please enter a valid email address" });
      return;
    }

    // ── Block domains with no valid TLD (e.g. newton@aedgf) ──────
    const emailDomain = email.split("@")[1]?.toLowerCase();
    const domainParts = emailDomain?.split(".");
    if (!domainParts || domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      res.status(400).json({ message: "Please enter a valid email address with a real domain (e.g. gmail.com)" });
      return;
    }

    // ── Block known disposable/fake email domains ─────────────────
    const blockedDomains = [
      "mailinator.com", "guerrillamail.com", "temp-mail.org", "throwam.com",
      "yopmail.com", "trashmail.com", "sharklasers.com", "grr.la",
      "guerrillamail.info", "guerrillamail.biz", "guerrillamail.de",
      "guerrillamail.net", "guerrillamail.org", "spam4.me", "fakeinbox.com",
      "maildrop.cc", "dispostable.com", "trashmail.me", "trashmail.at",
      "trashmail.io", "tempmail.com", "10minutemail.com", "getairmail.com",
      "discard.email", "filzmail.com", "binkmail.com", "bobmail.info",
    ];
    if (blockedDomains.includes(emailDomain)) {
      res.status(400).json({ message: "Disposable email addresses are not allowed. Please use a real email." });
      return;
    }

    // ── Only allow Gmail addresses ────────────────────────────────
    if (emailDomain !== "gmail.com") {
      res.status(400).json({ message: "Please enter a valid email address." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "An account with this email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, isVerified: true },
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// OTP functions removed

// ─── LOGIN — allows all accounts ──────────────────────────
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Account not found. Please sign up first." });
      return;
    }

    if (!user.password) {
      res.status(401).json({ message: "This account was created using Google. Please Sign in with Google." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Incorrect password. Please try again." });
      return;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ─── GOOGLE LOGIN (auto-verified) ────────────────────────────────
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, intent } = req.body;

    if (!token) {
      res.status(400).json({ message: "No token provided" });
      return;
    }

    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!googleRes.ok) {
      res.status(400).json({ message: "Invalid Google token" });
      return;
    }

    const payload: any = await googleRes.json();
    if (!payload || !payload.email) {
      res.status(400).json({ message: "Invalid Google token payload" });
      return;
    }

    const { email, name, picture } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      if (intent === "login") {
        res.status(404).json({ message: "Account not found. Please sign up first." });
        return;
      }
      user = await prisma.user.create({
        data: { email, name: name || "User", avatar: picture || null, isVerified: true },
      });
    } else {
      if (intent === "register") {
        res.status(400).json({ message: "An account with this email already exists. Please log in." });
        return;
      }
      if (!user.isVerified) {
        // Auto-verify Google users
        user = await prisma.user.update({ where: { email }, data: { isVerified: true } });
      }
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Google login failed", error });
  }
};

// ─── GET ME ───────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
