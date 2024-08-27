import express from "express";
import {
  getMessagesBetweenUserAndStore,
  getUnreadMessagesCount,
  getUsersWhoMessagedStore,
  sendMessage,
} from "../controllers/chat/chat";

const router = express.Router();

router.post("/chat", sendMessage);
router.get("/store-user-messages", getMessagesBetweenUserAndStore);
router.get("/store-users-chat", getUsersWhoMessagedStore);
router.get("/unread-message-count", getUnreadMessagesCount);

export default router;
