import express from "express";
import {
  addToFavorite,
  getFavorites,
  getOneFavorites,
  updateFavorite,
} from "../controllers/favorite/favorite";

const router = express.Router();

router.post("/favorite/add", addToFavorite);
router.put("/favorite/update", updateFavorite);
router.get("/favorites", getFavorites);
router.get("/favorite/:_id", getOneFavorites);

export default router;
