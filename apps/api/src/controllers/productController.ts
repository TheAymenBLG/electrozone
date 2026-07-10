import type { Request, Response } from "express";
import {
  listProducts, getProduct, getProductsByCategory,
  upsertProduct, deleteProduct,
} from "../services/productService.js";

export async function listProductsController(_req: Request, res: Response) {
  res.json(await listProducts());
}

export async function getProductController(req: Request, res: Response) {
  const p = await getProduct(req.params.id);
  if (!p) return res.status(404).json({ error: "Product not found" });
  res.json(p);
}

export async function productsByCategoryController(req: Request, res: Response) {
  res.json(await getProductsByCategory(req.params.slug));
}

export async function saveProductController(req: Request, res: Response) {
  res.json(await upsertProduct(req.body));
}

export async function deleteProductController(req: Request, res: Response) {
  await deleteProduct(req.params.id);
  res.json({ ok: true });
}