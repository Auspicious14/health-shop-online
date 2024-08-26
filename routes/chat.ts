import express from "express";
import {
  getMessagesBetweenUserAndStore,
  getUsersWhoMessagedStore,
  sendMessage,
} from "../controllers/chat/chat";

const router = express.Router();

router.post("/chat", sendMessage);
router.get("/store-user-messages", getMessagesBetweenUserAndStore);
router.get("/store-users-chat", getUsersWhoMessagedStore);

export default router;
