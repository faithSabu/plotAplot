import Chat from "../models/chat.model.js";

export const createChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (chat) return res.status(403).json({ message: "Chat already exists" });

    const newChat = await Chat.create({
      members: [req.body.senderId, req.body.receiverId],
    });
    return res.status(201).json(newChat);
  } catch (error) {
    next(error);
  }
};

export const userChats = async (req, res, next) => {
  try {
    const chat = await Chat.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

export const findChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};
