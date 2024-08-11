import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import orderModel, { IOrder } from "../../models/order";
import cartModel, { ICart } from "../../models/cart";
import StoreModel, { IStore } from "../../models/store";
const https = require("https");
import dotenv from "dotenv";
import userAuthModel from "../../models/userAuth";
import productModel from "../../models/products";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { apiReq } from "../../middlewares/axios";

dotenv.config();

export const PlaceOrder = async (req: Request, res: Response) => {
  const { userId, amount, address } = req.body;
  try {
    const cart = await cartModel.find({ userId });
    if (!cart) res.json({ message: "Cart not found" });
    const order: any = new orderModel({ amount, address, cart, userId });
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    order.deliveryDate = deliveryDate;
    const data = await order.save();

    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { storeId } = req.query;

  try {
    if (storeId) {
      const store: IStore | null = await StoreModel.findById(storeId);
      if (store?._id != storeId)
        return res
          .status(400)
          .json({ success: false, message: "Unathoriszed" });
    }

    const data: any = await orderModel.findOneAndUpdate(
      { _id: id },
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
    if (!data) {
      res.json({ message: "Order not found" });
    }
    res.json({ message: "order successfully deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserOrder = async (req: Request, res: Response) => {
  const id = req.query.userId;
  try {
    let updatedOrders;
    const orders = await orderModel.find({ userId: id }).lean();
    if (orders) {
      const orderPromises = orders.map(async (order: IOrder) => {
        const cartPromises = order.cart.map(async (c: ICart) => {
          const product = await productModel.findById(c.productId).lean();

          return {
            ...c,
            product,
          };
        });

        const updatedCart = await Promise.all(cartPromises);
        return {
          ...order,
          cart: updatedCart,
        };
      });

      updatedOrders = await Promise.all(orderPromises);
    }
    res.json({ data: updatedOrders });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getOneOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { storeId } = req.query;

  try {
    if (storeId) {
      const store: IStore | null = await StoreModel.findById(storeId);
      if (store?._id != storeId)
        return res
          .status(400)
          .json({ success: false, message: "Unathoriszed" });
    }
    let query: any = {};
    let updatedCart: any;
    if (storeId) query.storeId = storeId;
    if (id) query._id = id;

    const order = await orderModel.findOne(query).lean();
    if (order?._id != id) return res.json({ error: "order not found" });

    const cartPromises = order.cart.map(async (c: ICart) => {
      const product = await productModel.findById(c.productId).lean();
      const store = await StoreModel.findById(product?.storeId)
        .select("-password")
        .lean();
      return {
        ...c,
        product,
        store,
      };
    });

    updatedCart = await Promise.all(cartPromises);
    res.json({
      data: {
        ...order,
        cart: updatedCart,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getAllUserOrder = async (req: Request, res: Response) => {
  const { storeId, userId } = req.query;
  try {
    if (storeId) {
      const store: IStore | null = await StoreModel.findById(storeId);
      if (store?._id != storeId)
        return res
          .status(400)
          .json({ success: false, message: "Unathoriszed" });
    }

    let query: any = {};
    if (storeId) query.storeId = storeId;
    if (userId) query.userId = userId;

    let updatedOrders;
    const orders = await orderModel.find(query).lean();
    if (orders) {
      const orderPromises = orders.map(async (order: IOrder) => {
        const cartPromises = order.cart.map(async (c: ICart) => {
          const product = await productModel.findById(c.productId).lean();

          return {
            ...c,
            product,
          };
        });

        const updatedCart = await Promise.all(cartPromises);
        return {
          ...order,
          cart: updatedCart,
        };
      });

      updatedOrders = await Promise.all(orderPromises);
    }
    res.json({ data: updatedOrders });
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

export const payment = async (req: Request, res: Response) => {
  const { api } = await apiReq();
  const { userId, amount, order } = req.body;

  if (!userId) res.json({ message: "Unauthorised" });

  const user = await userAuthModel.findById(userId);
  if (!user) res.json({ message: "No user found" });

  const params = JSON.stringify({
    email: user?.email,
    amount: amount * 100,
  });

  const response = await api.post("/transaction/initialize", params);

  if (!response.data) throw new Error(response?.data?.error);
  res.json({ data: response.data });
  // automateTransfer(order);
};

const automateTransfer = async (order: IOrder) => {
  let reference = uuidv4();
  const carts = order.cart.map((c) => c);
  const productIds = order.cart.map((c) => c.productId);

  const products = await Promise.all(
    productIds.map(async (id) => await productModel.findById(id))
  );

  const storeIds = products.map((p) => p?.storeId);
  const stores = await Promise.all(
    storeIds.map(async (id) => await StoreModel.findById(id))
  );

  const storeEmail = stores.map((s) => s?.email);
  const productsAmount = carts.map((c) => c.amount?.toString());

  let payload = stores.map((s, index) => ({
    recipient: s?.recipientCode,
    amount: productsAmount[index],
    reference,
    reason: "Payment Transfer for goods bought",
  }));

  const params = {
    source: "balance",
    currency: "NGN",
    transfers: payload,
  };

  stores.map(async (s) => {
    if (!s?.recipientCode) {
      await Promise.all(
        stores.map(async (s) => await createTransferRecipient(s))
      );
    }
  });

  const { api } = await apiReq();
  const response = await api.post("/transfer/bulk", JSON.stringify(params));
  console.log(response.data);
};

const createTransferRecipient = async (payload: IStore | null) => {
  const { api } = await apiReq();

  const store = await StoreModel.findById(payload?.id);
  if (!store) throw new Error("No Store found");

  const params = JSON.stringify({
    type: "nuban",
    currency: "NGN",
    name: store?.bankAccountName,
    account_number: store?.bankAccountNumber,
    bank_code: store?.bankCode,
  });

  const response = await api.post("/transferrecipient", params);

  if (!response.data) throw new Error("Error creating transfer recipient");

  const updateStore = await StoreModel.findByIdAndUpdate(
    { _id: store?.id },
    { $set: { recipientCode: response.data.recipient_code } },
    { new: true }
  );
};

export const refund = async (req: Request, res: Response) => {
  const order = req.body;

  try {
    const oneOrder = await orderModel.findById(order._id);
    if (!oneOrder) res.json({ message: "No order found" });

    const currentDate = new Date();
    const orderDate = new Date(oneOrder?.createdAt as string);
    const threeDaysAhead = new Date(currentDate);
    threeDaysAhead.setDate(currentDate.getDate() + 3);

    if (orderDate < threeDaysAhead) {
      console.log("The order date is within the past 3 days.");
    } else {
      console.log("The order date is more than 3 days ago.");
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
