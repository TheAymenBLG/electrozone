import type { Request, Response } from "express";
import { listBundles, getBundle, upsertBundle, deleteBundle } from "../services/bundleService.js";

export async function listBundlesController(_req: Request, res: Response) {
  res.json(await listBundles());
}

export async function getBundleController(req: Request, res: Response) {
  const b = await getBundle(req.params.id);
  if (!b) return res.status(404).json({ error: "Bundle not found" });
  res.json(b);
}

export async function saveBundleController(req: Request, res: Response) {
  res.json(await upsertBundle(req.body));
}

export async function deleteBundleController(req: Request, res: Response) {
  await deleteBundle(req.params.id);
  res.json({ ok: true });
}