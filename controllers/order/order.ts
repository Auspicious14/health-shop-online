import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import orderModel from "../../models/order";
import cartModel from "../../models/cart";
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
  try {
    const data: any = await orderModel.findByIdAndUpdate(
      id,
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
  try {
    const data: any = await orderModel.findByIdAndDelete(id);
    res.json({ message: "order successfully deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserOrder = async (req: Request, res: Response) => {
  const id = req.params.userId;
  try {
    const data: any = await orderModel.find({ id });
    if (data._id != id) return res.json({ error: "order not found" });
    console.log(data);
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getAllUserOrder = async (req: Request, res: Response) => {
  try {
    const data: any = await orderModel.find();
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
  // console.log(params);
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
