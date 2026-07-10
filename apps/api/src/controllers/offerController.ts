import type { Request, Response } from "express";
import { listOffers, upsertOffer, deleteOffer } from "../services/offerService.js";

export async function listOffersController(_req: Request, res: Response) {
  res.json(await listOffers());
}

export async function saveOfferController(req: Request, res: Response) {
  res.json(await upsertOffer(req.body));
}

export async function deleteOfferController(req: Request, res: Response) {
  await deleteOffer(req.params.id);
  res.json({ ok: true });
}