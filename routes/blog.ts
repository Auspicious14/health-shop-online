import express from "express";
import {
  createBlog,
  deleteblog,
  getblogs,
  getOneblog,
  updateblog,
} from "../controllers/blog/blog";

import { verifyTokenAndAdmin } from "../middlewares/verifyToken";
const router = express.Router();

router.post("/product", verifyTokenAndAdmin, createBlog);
router.put("/product/:id", verifyTokenAndAdmin, updateblog);
router.get("/products", getblogs);
router.get("/product/:id", getOneblog);
router.delete("/product/:id", deleteblog);
export default router;
