import type { Request, Response } from "express";
import { loginAdmin } from "../services/authService.js";

export async function loginController(req: Request, res: Response) {
  const { password } = req.body as { password?: string };
  if (!password) return res.status(400).json({ error: "password required" });
  const token = loginAdmin(password);
  if (!token) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ token });
}