import { Router } from "express";
import {
  listProductsController, getProductController, productsByCategoryController,
  saveProductController, deleteProductController,
} from "../controllers/productController.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { requireAdmin } from "../middleware/auth.js";
import { saveProductBodySchema, idParamSchema, slugParamSchema } from "@electrozone/shared";

export const productRouter = Router();

productRouter.get("/", listProductsController);
productRouter.get("/by-category/:slug", validateParams(slugParamSchema), productsByCategoryController);
productRouter.get("/:id", validateParams(idParamSchema), getProductController);

productRouter.post("/", requireAdmin, validateBody(saveProductBodySchema), saveProductController);
productRouter.delete("/:id", requireAdmin, validateParams(idParamSchema), deleteProductController);