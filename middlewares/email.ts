import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
const handlebars = require("handlebars");
dotenv.config();

export const sendEmail = async (email: any, subject: any, text: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      service: "gmail",
      // requireTLS: true,
      // port: 456,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const options = () => {
      return {
        from: `Auspicious: <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject,
        // html: `<div>${text}</div>`,
        html: text,
      };
    };

    // Send email
    return await transporter.sendMail(options());
  } catch (error) {
    return error;
  }
};
