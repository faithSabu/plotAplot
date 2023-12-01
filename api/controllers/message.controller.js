import Message from "../models/message.model.js";

export const addMessage = async (req, res, next) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = await Message.create({
      chatId,
      senderId,
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
