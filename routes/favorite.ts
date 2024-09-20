import express from "express";
import {
  addToFavorite,
  getFavorites,
  getOneFavorites,
} from "../controllers/favorite/favorite";

const router = express.Router();

router.post("/favorite/add", addToFavorite);
router.get("/favorites", getFavorites);
router.get("/favorite/:_id", getOneFavorites);

export default router;
