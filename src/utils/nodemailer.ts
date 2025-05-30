import nodemailer from "nodemailer";
import { varible } from "@/schemas/envSchema";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: varible.EMAIL,
    pass: varible.EMAIL_PASSWORD,
  },
});
