const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as argon2 from "argon2";
import userAuthModel from "../models/userAuth";
import { handleErrors } from "../middlewares/userAuth";
dotenv.config();
const secret = process.env.TOKEN_SECRET;
const expiresIn = 60 * 60;

const createToken = (id: string) => {
  return jwt.sign({ id }, secret, { expiresIn });
};
export const createUserAuth = async (req: Request, res: Response) => {
  console.log(req.body);
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword);
    const user: any = await userAuthModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: expiresIn * 1000 });
    res.json({ user });
  } catch (error) {
    console.log(error);
    const err = handleErrors(error);
    res.json({ err });
  }
};

export const loginUserAuth = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const user: any = await userAuthModel.findOne(email);
    if (!user.email) return res.json({ error: "Email Not found" });
    const comparePassword: boolean = await argon2.verify(
      user.password,
      password
    );
    if (!comparePassword) return res.json({ error: "Password Not matched" });
    const token = createToken(user?._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: expiresIn * 1000 });
    res.json({ user, token });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
