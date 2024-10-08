import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updatecategory,
} from "../controllers/category/category";

const categoryRoute = express.Router();

categoryRoute.post("/category", createCategory);
categoryRoute.put("/category/:id", updatecategory);
categoryRoute.get("/category", getCategories);
categoryRoute.get("/category/:slug", getCategory);
categoryRoute.delete("/category/:id", deleteCategory);

export default categoryRoute;
