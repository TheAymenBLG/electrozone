import { Router } from "express";
import { createOrderController, listOrdersController } from "../controllers/orderController.js";
import { validateBody } from "../middleware/validate.js";
import { requireAdmin } from "../middleware/auth.js";
import { createOrderBodySchema } from "@electrozone/shared";

export const orderRouter = Router();

orderRouter.post("/", validateBody(createOrderBodySchema), createOrderController);
orderRouter.get("/", requireAdmin, listOrdersController);