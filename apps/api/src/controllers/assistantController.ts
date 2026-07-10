import type { Request, Response } from "express";
import { askAssistant } from "../services/assistantService.js";
import { getCatalog } from "../services/catalogService.js";

export async function assistantController(req: Request, res: Response) {
  const { history, message } = req.body;
  const catalog = await getCatalog();
  const reply = await askAssistant(history, message, catalog);
  res.json({ reply });
}