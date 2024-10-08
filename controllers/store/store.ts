import { Request, Response } from "express";
import * as argon2 from "argon2";
import StoreModel, { IStore } from "../../models/store";
import { mapFiles } from "../../middlewares/file";
import expressAsyncHandler from "express-async-handler";
import productModel from "../../models/products";

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
    accountType: "storeOwner",
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
      accepted: store?.accepted,
      accountType: store?.accountType,
      // phoneNumber: store?.phoneNumber,
      whatsAppNumber: store?.whatsAppNumber,
      storePhoneNumber: store?.storePhoneNumber,
      storeName: store?.storeName,
    },
  });
});

export const updateStore = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { images, identificationImage, ...values } = req.body;

  try {
    const existingStore = await StoreModel.findById(id);
    if (!existingStore)
      return res.json({ success: false, message: "Store does not exist" });
    const files = await mapFiles(images);
    const idImage = await mapFiles(identificationImage);
    const store = await StoreModel.findByIdAndUpdate(
      id,
      { $set: { images: files, identificationImage: idImage, ...values } },
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
    const { storeName } = req.query;
    let stores: IStore[] = [];

    if (storeName) {
      stores = await StoreModel.find({
        storeName: { $regex: storeName, $options: "i" },
      }).select("-password");
    } else {
      stores = await StoreModel.find().select("-password");
    }
    res.json({ success: true, data: stores });
  }
);

export const getUserStore = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const store = await StoreModel.findById(id).select("-password");
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

export const newStores = expressAsyncHandler(
  async (req: Request, res: Response) => {
    let stores: IStore[] = [];

    stores = await StoreModel.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: stores });
  }
);

export const topStores = expressAsyncHandler(
  async (req: Request, res: Response) => {
    let stores: IStore[] = [];

    stores = await StoreModel.find()
      .select("-password")
      .sort({ createdAt: 1 })
      .limit(10);

    res.json({ success: true, data: stores });
  }
);

export const featuredStores = expressAsyncHandler(
  async (req: Request, res: Response) => {
    let stores: IStore[] = [];
    let featuredStores = [];
    stores = await StoreModel.find().select("-password");

    const mapStores = stores?.map(async (s) => {
      const products = await productModel.find({ storeId: s._id });
      if (products.length > 20) {
        return {
          featuredStore: s,
          count: products?.length,
        };
      }
      return null;
    });

    const fs = await Promise.all(mapStores);
    featuredStores = fs.filter((s) => s !== null);

    console.log(featuredStores, "featured storess");
    res.json({ success: true, data: featuredStores });
  }
);
