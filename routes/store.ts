import express from "express";
import {
  createStore,
  deleteStore,
  featuredStores,
  getAllStores,
  getUserStore,
  newStores,
  topStores,
  updateStore,
} from "../controllers/store/store";
import { verifyTokenAndAdmin } from "../middlewares/verifyToken";
import { acceptStore, rejectStore } from "../controllers/store/accept";

const router = express.Router();

router.post("/store", createStore);
router.put("/store/:id", updateStore);
router.delete("/store/delete/:id", deleteStore);
router.get("/stores", getAllStores);
router.get("/store/:id", getUserStore);
router.post("/store/accept", acceptStore);
router.post("/store/reject", rejectStore);
router.get("/stores/new", newStores);
router.get("/stores/top", topStores);
router.get("/stores/featured", featuredStores);

export default router;
