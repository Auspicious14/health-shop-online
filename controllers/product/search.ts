import { Request, Response } from "express";
import { mapFiles } from "../../middlewares/file";
import { imageLabelDetection } from "../../middlewares/imageSearch";
import productModel from "../../models/products";

export const getProductsByImage = async (req: Request, res: Response) => {
  const { file } = req.body;
  try {
    let products: any[] = [];
    const images = await mapFiles([file]);

    if (!images)
      res
        .status(400)
        .json({ success: false, message: "Errror uploading image to server" });

    const resultData = await imageLabelDetection(images[0]?.uri);
    const results = Array.from(new Set(resultData));

    if (!results) {
      res
        .status(400)
        .json({ sucess: false, message: "Error searching products" });
      return;
    }
    const pattern = results.map((c) => c.trim()).join("|");
    products = await productModel.find({
      name: {
        $regex: pattern,
        $options: "i",
      },
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
