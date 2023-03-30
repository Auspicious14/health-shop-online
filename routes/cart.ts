import express from "express";
import {
  AddToCart,
  deleteCart,
  getAllUserCart,
  getUserCart,
  updateCart,
} from "../controllers/cart/cart";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} from "../middlewares/verifyToken";
const router = express.Router();

router.post("/cart", AddToCart);
router.put("/cart/:id", verifyTokenAndAuth, updateCart);
router.delete("/cart/:id", verifyTokenAndAuth, deleteCart);
router.get("/cart/:userId", verifyTokenAndAuth, getUserCart);
router.get("/carts", verifyTokenAndAdmin, getAllUserCart);

export default router;
