import express from "express";
import { createUserAuth, loginUserAuth } from "../controllers/userAuth";
const router = express.Router();

router.post("/signup", createUserAuth);
router.post("/login", loginUserAuth);
export default router;
