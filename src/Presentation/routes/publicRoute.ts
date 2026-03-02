
import express from "express";
import { container } from "tsyringe";
import { PublicController } from "../controllers/PublicController";

const router = express.Router();

const publicController = container.resolve(PublicController);

router.get('/services', publicController.getPublicServices);
router.post('/refresh-token',publicController.refreshToken)
router.post('/verify-otp/trainer', publicController.verifyTrainerAccount);
router.post('/verify-otp/user', publicController.verifyUserAccount);
router.post('/resend-otp',publicController.resendOtp)
export default router;