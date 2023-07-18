import { Request, Response } from "express";
import reviewModel from "../../models/review";
import { handleErrors } from "../../middlewares/errorHandler";
import userAuthModel from "../../models/userAuth";

export const createReview = async (req: Request, res: Response) => {
  const { userId, title, description, rating, productId } = req.body;
  try {
    let user;
    if (userId) {
      user = await userAuthModel.findById({ _id: userId }).select("-password");
    }
    const review: any = await reviewModel.create({
      description,
      productId,
      title,
      rating,
      user,
    });
    // console.log(user);
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
    let review = await reviewModel.find({ productId });
    if (!review) res.json({ success: false, message: "Review not found" });

    const totalProductRating: number = review
      .map((r: any) => {
        return r.rating;
      })
      .reduce((a: any, b: any) => a + b, 0);
    const totalReview: number = review.length;
    const overAllRating: number = totalProductRating / totalReview;
    console.log(overAllRating);
    res.json({
      success: true,
      message: "Success",
      data: { review, total: overAllRating },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: errors,
    });
  }
};
