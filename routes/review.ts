import express from "express";
import {
  createReview,
  getReview,
  updateReview,
} from "../controllers/review/review";

const reviewRoute = express.Router();

reviewRoute.post("/review", createReview);
reviewRoute.put("/review/:id", updateReview);
reviewRoute.get("/review/:productId", getReview);

export default reviewRoute;
