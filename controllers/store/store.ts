import { Request, Response } from "express";
import * as argon2 from "argon2";
import StoreModel from "../../models/store";
import { mapFiles } from "../../middlewares/file";
import expressAsyncHandler from "express-async-handler";

export const createStore = expressAsyncHandler(async (req: any, res: any) => {
  const { password, email, ...values } = req.body;

  // res.status(400).json({ success: false, error });
  const existingStore = await StoreModel.findOne({ email });

  if (existingStore)
    return res.status(401).json({
      success: false,
      message: "Store Already exist",
    });
  const hashedPassword = await argon2.hash(password);
  const store = await StoreModel.create({
    email,
    password: hashedPassword,
    ...values,
  });
  return res.status(200).json({
    success: true,
    message: "Store created successfully",
    store: {
      _id: store?._id,
      firstName: store?.firstName,
      lastName: store?.lastName,
      email: store?.email,
      // phoneNumber: store?.phoneNumber,
      whatsAppNumber: store?.whatsAppNumber,
      storePhoneNumber: store?.storePhoneNumber,
      storeName: store?.storeName,
    },
  });
});

export const updateStore = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { images, ...values } = req.body;

  try {
    const existingStore = await StoreModel.findById(id);
    if (!existingStore)
      return res.json({ success: false, message: "Store does not exist" });
    const files = await mapFiles(images);
    const store = await StoreModel.findByIdAndUpdate(
      id,
      { $set: { images: files, values } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const getAllStores = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const stores = await StoreModel.find();
    res.json({ success: true, data: stores });
  }
);

export const getUserStore = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const store = await StoreModel.findById(id);
    if (store?.id != id)
      return res.json({ success: false, message: "Store does not exist" });
    res.status(200).json({ success: true, data: store });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const store = await StoreModel.findById(id);
    if (!store)
      return res.json({ success: false, message: "Store does not exist" });
    await StoreModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Store deleted" });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
