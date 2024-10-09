import { Request, Response } from "express";
import { mapFiles } from "../../middlewares/file";
import { imageLabelDetection } from "../../middlewares/imageSearch";
import productModel from "../../models/products";

export const getProductsByImage = async (req: Request, res: Response) => {
  const { file } = req.body;
  try {
    const images = await mapFiles(file);

    if (!images)
      res
        .status(400)
        .json({ success: false, message: "Errror uploading image to server" });

    const result = await imageLabelDetection(images[0]?.uri);

    if (!result) {
      res
        .status(400)
        .json({ sucess: false, message: "Error searching products" });
      return;
    }
    const products = await productModel.find({ name: result });
    console.log(products);
    res.status(200).json({ success: true, data: products });
    console.log(result, "resultttt");
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
