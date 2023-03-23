import express from "express";
import {
  AddToCart,
  deleteCart,
  getCart,
  updateCart,
} from "../controllers/cart/cart";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} from "../middlewares/verifyToken";
const router = express.Router();

router.post("/cart", verifyToken, AddToCart);
router.put("/cart/:id", verifyTokenAndAuth, updateCart);
router.delete("/cart/:id", verifyTokenAndAuth, deleteCart);
router.get("/cart/:userId", verifyToken, getCart);
router.get("/carts", verifyTokenAndAdmin, getCart);

export default router;
