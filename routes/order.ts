import express from "express";
import {
  deleteOrder,
  PlaceOrder,
  updateOrder,
  getAllUserOrder,
  payment,
  getOneOrder,
} from "../controllers/order/order";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/verifyToken";
const router = express.Router();

router.post("/order", PlaceOrder);
router.put("/order/:id", verifyTokenAndAdmin, updateOrder);
router.delete("/order/:id", verifyTokenAndAdmin, deleteOrder);
router.get("/order/:id", getOneOrder);
router.get("/orders", verifyToken, getAllUserOrder);
router.post("/payment", payment);

export default router;
