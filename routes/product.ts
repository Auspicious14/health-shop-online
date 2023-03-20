import express from "express";
import createProducts from "../controllers/product/createProduct";
import getProducts from "../controllers/product/getProduct";
const router = express.Router();

router.get("/product", getProducts);
router.post("/product", createProducts);
export default router;
