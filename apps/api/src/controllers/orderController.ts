import type { Request, Response } from "express";
import { createOrder, listOrders } from "../services/orderService.js";

export async function createOrderController(req: Request, res: Response) {
  const order = await createOrder(req.body);
  res.status(201).json(order);
}

export async function listOrdersController(_req: Request, res: Response) {
  res.json(await listOrders());
}