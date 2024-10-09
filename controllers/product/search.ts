import { Request, Response } from "express";
import { mapFiles } from "../../middlewares/file";
import { imageSearchApi } from "../../middlewares/imageSearch";

export const ImageSearch = async (req: Request, res: Response) => {
  const { file } = req.body;
  try {
    const images = await mapFiles(file);

    if (!images)
      res
        .status(400)
        .json({ success: false, message: "Errror uploading image to server" });

    const result = await imageSearchApi(images[0]?.uri);

    // if (result)
    console.log(result, "resultttt");
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
