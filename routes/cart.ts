import express from "express";
import {
  AddToCart,
  deleteCart,
  emptyCart,
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
router.put("/cart/:id", updateCart);
router.delete("/cart/:id", deleteCart);
router.delete("/cart/delete/:id", emptyCart);
router.get("/cart/:userId", verifyTokenAndAuth, getUserCart);
router.get("/carts", verifyTokenAndAdmin, getAllUserCart);

export default router;
