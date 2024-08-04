import { Request, Response } from "express";
import productModel from "../../models/products";
import { mapFiles } from "../../middlewares/file";
import StoreModel, { IStore } from "../../models/store";

export const createProducts = async (req: Request, res: Response) => {
  const { storeId, images, ...values } = req.body;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathorized" });

    const files = await mapFiles(images);
    const product: any = new productModel({
      ...values,
      images: files,
      storeId,
    });
    const data: any = await product.save();
    res.json({ data });
  } catch (error) {
    res.json({ error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { storeId, images, ...values } = req.body;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathorized" });

    const files = await mapFiles(images);
    const data: any = await productModel.findOneAndUpdate(
      { _id: id, storeId },
      { $set: { ...values, images: files, storeId } },
      {
        new: true,
      }
    );
    res.json({ data });
  } catch (error) {
    res.json({ error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { storeId } = req.query;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathorized" });

    if (id == "" || !id)
      return res.status(400).json({ success: false, message: "Invalid value" });

    const data: any = await productModel.findOneAndDelete({ _id: id, storeId });
    if (data) {
      res.json({ success: true, message: "Product deleted" });
    }
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const {
    storeId,
    category,
    brand,
    newArrival,
    name,
    maxPrice,
    minPrice,
    color,
  } = req.query;

  try {
    if (storeId) {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        return res
          .status(400)
          .json({ success: false, message: "Unauthorized" });
      }
    }

    const query: any = {};
    if (storeId) query.storeId = storeId;
    if (category) query.categories = { $in: [category] };
    if (name) query.name = name;
    if (brand) query.brand = brand;
    if (color) query.color = color;
    if (maxPrice && minPrice) query.price = { $gte: minPrice, $lte: maxPrice };

    let data;

    if (newArrival) {
      data = await productModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();
    } else {
      data = await productModel.find(query).exec();
    }

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await productModel.findOne({ _id: id });
    if (data._id != id) return res.json({ error: "product not found" });

    res.json({ data });
  } catch (error) {
    res.json({ error });
  }
};

// try {
//   if (storeId) {
//     const store: IStore | null = await StoreModel.findById(storeId);
//     if (store?._id != storeId)
//       return res.status(400).json({ success: false, message: "Unathorized" });
//   }

//   let data: any;
//   if (category) {
//     data = await productModel
//       .find({ storeId, categories: { $in: [category] } })
//       .exec();
//   } else if (newArrival) {
//     data = await productModel
//       .find({ storeId })
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .exec();
//   } else if (name) {
//     data = await productModel.find({ storeId, name }).exec();
//   } else if (brand) {
//     data = await productModel.find({ storeId, brand: brand }).exec();
//   } else if (maxPrice && minPrice) {
//     data = await productModel
//       .find({ storeId, price: { $gte: maxPrice, $lte: minPrice } })
//       .exec();
//   } else if (color) {
//     data = await productModel.find({ storeId, color }).exec();
//   } else if (storeId) {
//     data = await productModel.find({ storeId }).exec();
//   } else {
//     data = await productModel.find();
//   }

//   res.json({ data });
// } catch (error) {
//   res.json({ error });
// }
