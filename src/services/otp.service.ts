// services/otp.service.ts

import { OTP } from '../models/otp.model';
import { sendOtpEmail } from '../utils/emailUtils';

const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtpService = async (email: string) => {
  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.create({
    email,
    otp,
    expiresAt,
  });

  await sendOtpEmail(email, otp);

  return { message: 'OTP sent successfully' };
};

export const verifyOtpService = async (email: string, otp: string) => {
  const record = await OTP.findOne({ email, otp, verified: false });

  if (!record) {
    throw new Error('Invalid OTP');
  }

  if (record.expiresAt < new Date()) {
    throw new Error('OTP expired');
  }

  record.verified = true;
  await record.save();

  return { message: 'OTP verified successfully' };
};