import express from "express";
import {
  createUserAuth,
  deleteUserAuth,
  getUserAuth,
  getUsersAuth,
  loginUserAuth,
  updateuser,
} from "../controllers/auth/userAuth";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} from "../middlewares/verifyToken";
const router = express.Router();

router.post("/signup", createUserAuth);
router.post("/login", loginUserAuth);
router.put("/update/:id", verifyTokenAndAuth, updateuser);
router.delete("/delete/:id", verifyTokenAndAuth, deleteUserAuth);
router.get("/users", getUsersAuth);
router.get("/user/:id", verifyTokenAndAdmin, getUserAuth);

export default router;
