import express from "express";
import {
  createUserAuth,
  loginUserAuth,
  updateuser,
} from "../controllers/auth/userAuth";
import { verifyTokenAndAuth } from "../middlewares/verifyToken";
const router = express.Router();

router.post("/signup", createUserAuth);
router.post("/login", loginUserAuth);
router.put("/update/:id", verifyTokenAndAuth, updateuser);
export default router;
