import Message from "../models/message.js";

export const sendMessage = async (message, sender, receiver) => {
  if (!message || !sender || !receiver) {
    console.log("Invalid data passed into request");

    return res
      .status(400)
      .json({ error: "Please Provide All Fields To send Message" });
  }

  try {
    let newMessage = {
      sender,
      message,
      receiver,
    };

    let m = await Message.create(newMessage);

    m = await m.populate("sender", "name email");
    m = await m.populate("receiver", "-password");
    return { message: m, status: 200 };
  } catch (error) {
    return { error: error.message, status: 400 };
  }
};

export const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const getMessage = await Message.find({
      $and: [
        { $or: [{ sender: chatId }, { receiver: chatId }] },
        { $or: [{ sender: userId }, { receiver: userId }] },
      ],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(200).json(getMessage);
  } catch (error) {
    res.status(400);
    error.message;
  }
};

export const chatList = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const fetchMessage = await Message.findOne({
      $and: [
        { $or: [{ sender: chatId }, { receiver: chatId }] },
        { $or: [{ sender: userId }, { receiver: userId }] },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json(fetchMessage);
  } catch (error) {
    console.log(error);
  }
};
