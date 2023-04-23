import express from "express";
import {
  createUserAuth,
  deleteUserAuth,
  forgetPassword,
  getUserAuth,
  getUsersAuth,
  loginUserAuth,
  resetPassword,
  updatePassword,
  updateuser,
  verifyOTP,
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
router.get("/users", verifyTokenAndAdmin, getUsersAuth);
router.get("/user/:id", getUserAuth);
router.post("/forget", forgetPassword);
router.post("/verify", verifyOTP);
router.post("/reset", resetPassword);
router.post("/update/password", updatePassword);

export default router;
