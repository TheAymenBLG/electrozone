import { Router } from "express";
import { catalogController, categoriesController, productsController, bundlesController, offersController } from "../controllers/catalogController.js";

export const catalogRouter = Router();

catalogRouter.get("/", catalogController);
catalogRouter.get("/categories", categoriesController);
catalogRouter.get("/products", productsController);
catalogRouter.get("/bundles", bundlesController);
catalogRouter.get("/offers", offersController);