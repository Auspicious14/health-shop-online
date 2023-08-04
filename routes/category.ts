import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updatecategory,
} from "../controllers/category/category";

const categoryRoute = express.Router();

categoryRoute.post("/category", createCategory);
categoryRoute.put("/category/:id", updatecategory);
categoryRoute.get("/category", getCategories);
categoryRoute.delete("/category", deleteCategory);

export default categoryRoute;
