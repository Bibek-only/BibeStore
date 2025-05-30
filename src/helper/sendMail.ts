import { transporter } from "@/utils/nodemailer";
import { varible } from "@/schemas/envSchema";

type sendEamilType = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = (obj: sendEamilType) => {
  const mailOptions = {
    from: varible.EMAIL,
    to: obj.to,
    subject: obj.subject,
    html: obj.html
  };

  return transporter.sendMail(mailOptions);
};
