import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export interface AdminPayload {
  role: "admin";
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.adminApiKey, {
      issuer: config.jwtIssuer,
    }) as AdminPayload;
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Not an admin" });
    }
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}