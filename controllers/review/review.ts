import { Request, Response } from "express";
import reviewModel from "../../models/review";
import { handleErrors } from "../../middlewares/errorHandler";

export const createReview = async (req: Request, res: Response) => {
  try {
    const review: any = await reviewModel.create(req.body);
    if (review) {
      res.json({
        success: true,
        message: "Review created",
        data: review,
      });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: errors,
    });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, rating } = req.body;
  try {
    const review: any = await reviewModel.findByIdAndUpdate(
      id,
      {
        $set: { title, description, rating },
      },
      { new: true }
    );

    if (!review) res.json({ success: false, message: "Review not found" });

    res.json({
      success: true,
      message: "Review Updated",
      data: review,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: errors,
    });
  }
};

export const getReview = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const review: any = await reviewModel.find({ productId });
    if (productId !== review?.productId)
      res.json({ success: false, message: "Review not found" });

    res.json({
      success: true,
      message: "Success",
      data: review,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: errors,
    });
  }
};
