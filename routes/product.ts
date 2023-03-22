import express from "express";
import {
  createProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product/product";
import { verifyTokenAndAdmin } from "../middlewares/verifyToken";
const router = express.Router();

router.post("/product/:id", verifyTokenAndAdmin, createProducts);
router.put("/product/:id", verifyTokenAndAdmin, updateProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProduct);
export default router;
