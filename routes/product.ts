import express from "express";
import {
  createProducts,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsByCategorySlug,
  updateProduct,
} from "../controllers/product/product";
import { verifyTokenAndAdmin } from "../middlewares/verifyToken";
import { helper } from "./helper";
import { getProductsByImage } from "../controllers/product/search";

export class productRouter {
  router: express.Router;
  private helperSvc: helper;

  constructor() {
    this.helperSvc = new helper();
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/product",
      verifyTokenAndAdmin,
      this.helperSvc.routeHandler(createProducts)
    );
    this.router.put(
      "/product/:id",
      verifyTokenAndAdmin,
      this.helperSvc.routeHandler(updateProduct)
    );
    this.router.get("/products", this.helperSvc.routeHandler(getProducts));
    this.router.get(
      "/products/:slug",
      this.helperSvc.routeHandler(getProductsByCategorySlug)
    );
    this.router.get(
      "/products/image",
      this.helperSvc.routeHandler(getProductsByImage)
    );
    this.router.get("/product/:id", this.helperSvc.routeHandler(getProduct));
    this.router.delete(
      "/product/:id",
      this.helperSvc.routeHandler(deleteProduct)
    );
  }
}
