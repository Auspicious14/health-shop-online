const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
import { Request, Response } from "express";
import crypto from "crypto";
import * as argon2 from "argon2";
import userAuthModel from "../../models/userAuth";
import { handleErrors } from "../../middlewares/errorHandler";
import { sendEmail } from "../../middlewares/email";
import { generateOTP } from "../../middlewares/generateOTP";
dotenv.config();
const clientURL = process.env.CLIENT_URL;
const expiresIn = 60 * 60;

export const createUserAuth = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    const user: any = await userAuthModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.json({
      user: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        isAdmin: user?.isAdmin,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    });
  } catch (error) {
    const err = handleErrors(error);
    res.json({ err });
  }
};

export const loginUserAuth = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: any = await userAuthModel.findOne({ email });
    if (!user.email) return res.json({ error: "Account Not found" });
    const comparePassword: boolean = await argon2.verify(
      user.password,
      password
    );
    if (!comparePassword) return res.json({ error: "Wrong password" });
    res.json({
      user: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        isAdmin: user?.isAdmin,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateuser = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { firstName, lastName, email, password, isAdmin } = req.body;
  try {
    if (password) {
      password = await argon2.hash(password);
    }
    const user: any = await userAuthModel.findByIdAndUpdate(
      id,
      {
        $set: { firstName, lastName, email, password, isAdmin },
      },
      { new: true }
    );
    if (!user) return res.json({ error: "No user matched" });

    res.json({
      user: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        isAdmin: user?.isAdmin,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const deleteUserAuth = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user: any = await userAuthModel.findByIdAndDelete(id);
    res.json({ message: "user has been deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserAuth = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user: any = await userAuthModel.findById(id).select("-password");
    res.json({ user });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUsersAuth = async (req: Request, res: Response) => {
  const query = req.query.new;
  try {
    const users: any = query
      ? await userAuthModel
          .find()
          .select("-password")
          .sort({ _id: -1 })
          .limit(10)
      : await userAuthModel.find().select("-password");
    res.json({ users });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user: any = await userAuthModel.findOne({ email });
    if (!user)
      return res.json({
        success: false,
        message: "Account with the email does not exist",
      });
    const { otp, otpDate } = generateOTP();
    user.manageOTP.otp = otp;
    user.manageOTP.otpDate = otpDate;
    await user.save();
    sendEmail(user.email, "Password Reset", otp);

    res.json({
      success: true,
      message: `Check your mail for your verification code`,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp: userOtp } = req.body;
  try {
    const user: any = await userAuthModel.findOne({ email });
    if (!user)
      return res.json({
        success: false,
        message: "Account not found",
      });
    const { otp, otpDate } = user.manageOTP;
    const expiryDate = otpDate + 60 * 60 * 1000;

    if (otp !== userOtp)
      return res.json({
        success: false,
        message: "Incorrect OTP",
      });

    if (expiryDate < Date.now())
      return res.json({
        success: false,
        message: "OTP expired",
      });
    res.json({
      verified: true,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    const user: any = await userAuthModel.findOne(email);
    if (!user)
      return res.json({
        success: false,
        message: "Account not found",
      });

    const oldPassword = user.password;
    const comparePassword = await argon2.verify(oldPassword, newPassword);

    if (comparePassword)
      return res.json({
        success: false,
        message: "You entered your old password",
      });
    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.json({
      success: true,
      message: "Password successfully changed.",
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
