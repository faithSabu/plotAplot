import express from "express";
import {
  addMessage,
  getMessages,
  changeReadMessages,
  getUnreadMessages,
  getUnreadMessageByChatId,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", addMessage);
router.get("/getMessage/:chatId", getMessages);
router.get("/unreadMessageByChatId", getUnreadMessageByChatId);
router.get("/unreadMessages", getUnreadMessages);
router.get("/changeReadMessages", changeReadMessages);

export default router;
