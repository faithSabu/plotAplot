import express from "express";
import {
  createChat,
  userChats,
  findChat,
  findByChatId,
  changeUpdatedTime,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);
router.get("/findbyChatId/:chatId", findByChatId);
router.get("/changeUpdatedTime/:chatId", changeUpdatedTime);

export default router;
