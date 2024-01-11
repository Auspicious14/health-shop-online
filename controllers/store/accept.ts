import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import StoreModel from "../../models/store";
import { sendEmail } from "../../middlewares/email";

export const acceptStore = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.body;

  const store = await StoreModel.findByIdAndUpdate(
    id,
    { $set: { accepted: true } },
    { new: true }
  );
  if (store?._id != id)
    return res.status(400).json({
      success: false,
      message: "Store does not exist",
    });

  res.status(200).json({
    success: true,
    message: "Store Accepted",
    data: store,
  });
});

export const rejectStore = expressAsyncHandler(async (req: any, res: any) => {
  const { email, id, remark } = req.body;

  const store = await StoreModel.findByIdAndUpdate(
    id,
    { $set: { accepted: false } },
    { new: true }
  );

  if (!store)
    return res.status(400).json({
      success: false,
      message: "Store does not exist",
    });

  const mail = await sendEmail(
    email,
    "Reason(s) For Rejecting Your Store",
    remark
  );

  if (!mail)
    return res.status(502).json({
      success: false,
      message: "Unable to send mail",
    });
  res
    .status(200)
    .json({ success: true, message: "Store Rejected", data: store });
});
