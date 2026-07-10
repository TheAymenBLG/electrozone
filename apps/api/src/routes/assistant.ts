import { Router } from "express";
import { assistantController } from "../controllers/assistantController.js";
import { validateBody } from "../middleware/validate.js";
import { assistantBodySchema } from "@electrozone/shared";

export const assistantRouter = Router();

assistantRouter.post("/", validateBody(assistantBodySchema), assistantController);