// controllers/otp.controller.ts

import { Request, Response } from 'express';
import { sendOtpService, verifyOtpService } from '../services/otp.service';
import { SendOtpDto, VerifyOtpDto } from '../types/otp.types';

export const sendOtpController = async (
  req: Request<any>,
  res: Response
) => {
  try {
    const { email } = req.body;

    const result = await sendOtpService(email);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const verifyOtpController = async (
  req: Request<{}, {}, VerifyOtpDto>,
  res: Response
) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyOtpService(email, otp);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};