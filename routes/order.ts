import express from "express";
import {
  deleteOrder,
  PlaceOrder,
  updateOrder,
  getAllUserOrder,
  payment,
  getOneOrder,
  refund,
} from "../controllers/order/order";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/verifyToken";
const router = express.Router();

router.post("/order", PlaceOrder);
router.put("/order/:id", verifyToken, updateOrder);
router.delete("/order/:id", verifyTokenAndAdmin, deleteOrder);
router.get("/order/:id", getOneOrder);
router.get("/orders", verifyToken, getAllUserOrder);
router.post("/payment", payment);
router.post("/refund", verifyToken, refund);

export default router;
