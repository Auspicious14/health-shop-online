import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import { Server, Socket } from "socket.io";
import chatModel from "../../models/chat";
import StoreModel from "../../models/store";
import { sendEmail } from "../../middlewares/email";

const io = new Server();

export const sendMessage = async (req: Request, res: Response) => {
  const { storeId, userId, message, senderId } = req.body;

  try {
    const store = await StoreModel.findById(storeId).select("-password");
    if (store?._id != storeId) return res.json({ message: "Unauthorised" });

    let align: string;
    align = senderId == userId ? "right" : "left";
    align = senderId == storeId ? "right" : "left";

    io.emit("send_message", { storeId, userId, message, senderId, align });
    const newMessage = new chatModel({
      storeId,
      userId,
      message,
      senderId,
      align,
    });
    await newMessage.save();

    const text = "You have unread message";
    await sendEmail(store?.email, "Incoming Message", text);

    io.emit("new_message", {
      storeId,
      userId,
      message,
      senderId,
      align,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
    });

    res.json({
      success: true,
      message: "Message sent and broadcasted successfully.",
      data: newMessage,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getMessagesByStore = async (req: Request, res: Response) => {
  const { storeId, userId } = req.query;

  try {
    let query: any;

    if (storeId) query.storeId = storeId;
    if (userId) query.userId = userId;

    const messages = await chatModel.find();
    res.json(messages);
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUsersWhoMessagedStore = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.query;

    const messagesByUser = await chatModel.aggregate([
      { $match: { storeId } },
      {
        $group: {
          _id: "$userId",
          messages: { $push: "$$ROOT" },
          lastMessage: { $last: "$$ROOT" },
        },
      },
      {
        $addFields: {
          userId: { $toObjectId: "$_id" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $addFields: {
          unreadMessagesFromUser: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $and: [
                    { $eq: ["$$message.read", false] },
                    { $eq: ["$$message.senderId", "$userId"] },
                  ],
                },
              },
            },
          },
          unreadMessagesFromStore: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $and: [
                    { $eq: ["$$message.read", false] },
                    { $eq: ["$$message.senderId", "$storeId"] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          "user.firstName": 1,
          "user.lastName": 1,
          messages: 1,
          "lastMessage.message": 1,
          "lastMessage.images": 1,
          "lastMessage.createdAt": 1,
          unreadMessagesFromUser: 1,
          unreadMessagesFromStore: 1,
        },
      },
    ]);

    return res.json({ data: messagesByUser });
  } catch (error) {
    const errors = handleErrors(error);
    return res.json({ errors });
  }
};

export const getMessagesBetweenUserAndStore = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, storeId } = req.params;

    const messages = await chatModel.find({ userId, storeId }).sort({
      createdAt: 1,
    });

    return res.json({ success: true, data: messages });
  } catch (error) {
    const errors = handleErrors(error);
    return res.json({ errors });
  }
};

export const getUnreadMessagesCount = async (req: Request, res: Response) => {
  const { storeId, userId } = req.body;

  try {
    const data = await chatModel.countDocuments({
      storeId,
      userId,
      read: false,
    });

    return res.json({ success: true, data });
  } catch (error) {
    const errors = handleErrors(error);
    return res.json({ errors });
  }
};
// const users = await chatModel
// .find({ storeId })
// .distinct('userId')
// const conversations = await chatModel
// .find({ storeId, userId: { $in: users } })
// .sort({ createdAt: -1 })
// .populate('userId', 'firstName lastName')
// .group({
//   _id: "$userId",
//   lastMessage: { $first: "$$ROOT" }
// });
