import { Router } from "express";
import { listOffersController, saveOfferController, deleteOfferController } from "../controllers/offerController.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { requireAdmin } from "../middleware/auth.js";
import { saveOfferBodySchema, idParamSchema } from "@electrozone/shared";

export const offerRouter = Router();

offerRouter.get("/", listOffersController);

offerRouter.post("/", requireAdmin, validateBody(saveOfferBodySchema), saveOfferController);
offerRouter.delete("/:id", requireAdmin, validateParams(idParamSchema), deleteOfferController);