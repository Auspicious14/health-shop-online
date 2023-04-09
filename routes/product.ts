import express from "express";
import {
  createProducts,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product/product";
import { verifyTokenAndAdmin } from "../middlewares/verifyToken";
const router = express.Router();

router.post("/product", verifyTokenAndAdmin, createProducts);
router.put("/product/:id", verifyTokenAndAdmin, updateProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.delete("/product/:id", deleteProduct);
export default router;
