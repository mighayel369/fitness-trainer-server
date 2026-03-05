import express from 'express';
import { PaymentController } from 'Presentation/controllers/payment-controller';
import { container } from 'tsyringe';
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";

const router = express.Router();

const paymentController = container.resolve(PaymentController);

router.post(
  '/initiate',
  authorizeRoles(UserRole.USER),
  paymentController.initiateOnlinePayment
);


router.post(
  '/verify',
  authorizeRoles(UserRole.USER),
  paymentController.verifyOnlinePayment
);

export default router;