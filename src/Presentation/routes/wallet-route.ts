import express from "express";
import { container } from "tsyringe";
import { WalletController } from "Presentation/controllers/wallet-controller";
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";

const router = express.Router();
const walletController = container.resolve(WalletController);


router.get(
    '/',
    authorizeRoles(UserRole.ADMIN, UserRole.USER, UserRole.TRAINER), 
    walletController.fetchOwnerWallet
);

export default router;