// routes/otp.routes.ts

import { Router } from 'express';
import {
  sendOtpController,
  verifyOtpController,
} from '../controllers/otp.controller';

const router = Router();

router.post('/send', sendOtpController);
router.post('/verify', verifyOtpController);

export default router;