import express from "express";
import {
  createUserAuth,
  deleteInviteLink,
  deleteUserAuth,
  forgetPassword,
  generateInviteLink,
  getUserAuth,
  getUsersAuth,
  loginUserAuth,
  resetPassword,
  updatePassword,
  updateuser,
  validateInviteLink,
  verifyOTP,
} from "../controllers/auth/userAuth";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} from "../middlewares/verifyToken";
const router = express.Router();

router.post("/signup", createUserAuth);
router.post("/login", loginUserAuth);
router.post("/forget", forgetPassword);
router.post("/verify", verifyOTP);
router.post("/reset", resetPassword);
router.post("/update/password", updatePassword);
router.post("/validate", validateInviteLink);
router.get("/invite", generateInviteLink);
router.delete("/delete/invite/:link", deleteInviteLink);
router.get("/users", verifyTokenAndAdmin, getUsersAuth);
router.get("/user/:id", getUserAuth);
router.put("/update/:id", verifyTokenAndAuth, updateuser);
router.delete("/delete/:id", verifyTokenAndAuth, deleteUserAuth);

export default router;
