import e from "express";
import * as collectionController from "../controllers/collection.controller";
import * as imageControllers from "../controllers/image.controller";
import * as authControllers from "../controllers/auth.controller";

const collectionRouter = e.Router();

collectionRouter.post(
  "/",
  authControllers.protect,
  imageControllers.upload,
  collectionController.createCollection
);
collectionRouter.get(
  "/",
  authControllers.protect,
  collectionController.getCollections
);

export = collectionRouter;
