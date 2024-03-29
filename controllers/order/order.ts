import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import orderModel from "../../models/order";
import cartModel from "../../models/cart";
import StoreModel, { IStore } from "../../models/store";
const https = require("https");
import dotenv from "dotenv";
dotenv.config();

export const PlaceOrder = async (req: Request, res: Response) => {
  console.log(req.body);
  const { id, amount, address } = req.body;
  try {
    const cart = await cartModel.find({ userId: id });
    if (cart) {
      const order: any = new orderModel({ amount, address, cart, userId: id });
      const data = await order.save();
      res.json({ data });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { storeId } = req.query;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathoriszed" });

    const data: any = await orderModel.findOneAndUpdate(
      { _id: id, storeId },
      { $set: req.body },
      {
        new: true,
      }
    );
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { storeId } = req.query;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathoriszed" });

    const data: any = await orderModel.findOneAndDelete({ _id: id, storeId });
    res.json({ message: "order successfully deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserOrder = async (req: Request, res: Response) => {
  const id = req.params.userId;
  try {
    const data: any = await orderModel.find({ userId: id });
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
export const getOneOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { storeId } = req.query;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathoriszed" });

    const data: any = await orderModel.findOne({ _id: id, storeId });
    if (data?._id != id) return res.json({ error: "order not found" });
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getAllUserOrder = async (req: Request, res: Response) => {
  const { storeId } = req.query;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathoriszed" });

    const data: any = await orderModel.find({ storeId });
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const orderStats = async (req: Request, res: Response) => {
  const date: Date = new Date();
  const lastMonth: Date = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth: Date = new Date(
    new Date().setMonth(lastMonth.getMonth() - 1)
  );

  try {
    const stats: any = await orderModel.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    res.json({ stats });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const payment = async (request: Request, response: Response) => {
  const params = JSON.stringify({
    email: request.body.email,
    amount: request.body.amount * 100,
  });
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  };

  const paystackRequest = https
    .request(options, (res: any) => {
      let data = "";

      res.on("data", (chunk: any) => {
        data += chunk;
      });

      res.on("end", () => {
        response.json(JSON.parse(data));
        // console.log(JSON.parse(data));
      });
    })
    .on("error", (error: any) => {
      console.error(error);
      const err = handleErrors(error);
      response.json(err);
    });

  paystackRequest.write(params);
  paystackRequest.end();
};
