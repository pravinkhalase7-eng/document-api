// utils/mailer.ts

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  return transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`,
  });
};