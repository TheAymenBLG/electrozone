import type { Request, Response } from "express";
import { getCatalog, getCategories, getProducts, getBundles, getOffers } from "../services/catalogService.js";

export async function catalogController(_req: Request, res: Response) {
  const data = await getCatalog();
  res.json(data);
}

export async function categoriesController(_req: Request, res: Response) {
  const data = await getCategories();
  res.json(data);
}

export async function productsController(_req: Request, res: Response) {
  const data = await getProducts();
  res.json(data);
}

export async function bundlesController(_req: Request, res: Response) {
  const data = await getBundles();
  res.json(data);
}

export async function offersController(_req: Request, res: Response) {
  const data = await getOffers();
  res.json(data);
}