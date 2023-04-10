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

router.post("/blog", verifyTokenAndAdmin, createBlog);
router.put("/blog/:id", verifyTokenAndAdmin, updateblog);
router.get("/blogs", getblogs);
router.get("/blog/:id", getOneblog);
router.delete("/blog/:id", deleteblog);
export default router;
