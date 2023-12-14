import Message from "../models/message.model.js";

export const addMessage = async (req, res, next) => {
  const { chatId, senderId, receiverId, text } = req.body;
  try {
    const message = await Message.create({
      chatId,
      senderId,
      receiverId,
      text,
    });
    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const { chatId } = req.params;
  try {
    const result = await Message.find({ chatId });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUnreadMessageByChatId = async (req, res, next) => {
  try {
    const result = await Message.aggregate([
      {
        $match: {
          $and: [
            { chatId: req.query.chatId },
            { senderId: req.query.senderId },
            { isRead: false },
          ],
        },
      },
      {
        $group: {
          _id: {
            senderId: "$senderId",
            chatId: "$chatId",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          chatId: "$_id.chatId",
          senderId: "$_id.senderId",
          count: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const changeReadMessages = async (req, res, next) => {
  try {
    const result = await Message.updateMany(
      {
        $and: [
          { chatId: req.query.chatId },
          { senderId: req.query.senderId },
          { isRead: false },
        ],
      },
      {
        $set: { isRead: true },
      }
    );
    res.status(200).json("Changed to isRead:true");
  } catch (error) {
    next(error);
  }
};

export const getUnreadMessages = async (req, res, next) => {
  try {
    const result = await Message.aggregate([
      {
        $match: {
          $and: [{ receiverId: req.query.currentUserId }, { isRead: false }],
        },
      },
      {
        $group: {
          _id: {
            senderId: "$senderId",
            chatId: "$chatId",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          chatId: "$_id.chatId",
          count: 1,
        },
      },
    ]);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
