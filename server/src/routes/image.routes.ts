import e from "express";
import * as imageController from "../controllers/image.controller";
import * as authControllers from "../controllers/auth.controller";

const imageRouter = e.Router();

imageRouter.post(
  "/:collectionId",
  authControllers.protect,
  imageController.createImage
);
imageRouter.delete(
  "/:collectionId/:unsplashId",
  authControllers.protect,
  imageController.removeImage
);
imageRouter.get("/search", imageController.search);
imageRouter.get(
  "/thumb",
  imageController.setResourcePolicy,
  imageController.getImage
);

export = imageRouter;
