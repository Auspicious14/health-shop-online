import express from "express";
import {
  deleteOrder,
  PlaceOrder,
  updateOrder,
  getAllUserOrder,
  getUserOrder,
  payment,
} from "../controllers/order/order";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} from "../middlewares/verifyToken";
const router = express.Router();

router.post("/order", PlaceOrder);
router.put("/order/:id", verifyTokenAndAdmin, updateOrder);
router.delete("/order/:id", verifyTokenAndAdmin, deleteOrder);
router.get("/order/:userId", verifyTokenAndAuth, getUserOrder);
router.get("/orders", getAllUserOrder);
router.post("/payment", payment);

export default router;
