import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
const handlebars = require("handlebars");
dotenv.config();

export const sendEmail = async (
  email: any,
  subject: any,
  payload: any,
  template: any
) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      service: "gmail",
      // requireTLS: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: `Auspicious: <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error: any, res: any) => {
      if (error) {
        return error;
      } else {
        return res.json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};
