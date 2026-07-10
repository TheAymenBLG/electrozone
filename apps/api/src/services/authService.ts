import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import type { AdminPayload } from "../middleware/auth.js";

export function loginAdmin(password: string): string | null {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";
  if (password !== adminPassword) return null;
  const payload: AdminPayload = { role: "admin" };
  return jwt.sign(payload, config.adminApiKey, { issuer: config.jwtIssuer, expiresIn: "12h" });
}