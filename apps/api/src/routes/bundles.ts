import { Router } from "express";
import {
  listBundlesController, getBundleController,
  saveBundleController, deleteBundleController,
} from "../controllers/bundleController.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { requireAdmin } from "../middleware/auth.js";
import { saveBundleBodySchema, idParamSchema } from "@electrozone/shared";

export const bundleRouter = Router();

bundleRouter.get("/", listBundlesController);
bundleRouter.get("/:id", validateParams(idParamSchema), getBundleController);

bundleRouter.post("/", requireAdmin, validateBody(saveBundleBodySchema), saveBundleController);
bundleRouter.delete("/:id", requireAdmin, validateParams(idParamSchema), deleteBundleController);