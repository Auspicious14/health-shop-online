import express from "express";
import {
  createStore,
  deleteStore,
  getAllStores,
  getUserStore,
  updateStore,
} from "../controllers/store/store";
import { verifyTokenAndAdmin } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/store", createStore);
router.post("/store/:id", updateStore);
router.delete("/store/delete/:id", verifyTokenAndAdmin, deleteStore);
router.get("/stores", getAllStores);
router.get("/store/:id", getUserStore);

export default router;
