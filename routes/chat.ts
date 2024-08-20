import express from "express";
import { getMessages, sendMessage } from "../controllers/chat/chat";

const router = express.Router();

router.post("/chat", sendMessage);
router.get("/chat", getMessages);

export default router;
