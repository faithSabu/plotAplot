import Chat from "../models/chat.model.js";

export const createChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (chat) return res.json({ message: "Chat already exists", chat });

    const newChat = await Chat.create({
      members: [req.body.senderId, req.body.receiverId],
    });
    return res.status(201).json({ message: "Chat created", chat: newChat });
  } catch (error) {
    next(error);
  }
};

export const userChats = async (req, res, next) => {
  try {
    const chat = await Chat.find({
      members: { $in: [req.params.userId] },
    }).sort({ updatedAt: "desc" });
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

export const findByChatId = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

export const changeUpdatedTime = async (req, res, next) => {
  try {
    const result = await Chat.findOneAndUpdate(
      { _id: req.params.chatId },
      { updatedAt: new Date() },
      {
        new: true,
        timestamps: false,
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
