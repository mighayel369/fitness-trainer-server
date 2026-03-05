import express from "express";
import { container } from "tsyringe";
import { AuthController } from "Presentation/controllers/auth-controller";
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";
import { upload } from "Presentation/middleware/upload";
import passport from 'passport';

const router = express.Router();
const authController = container.resolve(AuthController);


router.post('/user/register', authController.RegisterUser);
router.post('/user/login', authController.UserLogin);


router.post('/trainer/register', upload.single('certificate'), authController.RegisterTrainer);
router.post('/trainer/login', authController.TrainerLogin);


router.post('/admin/login', authController.AdminLogin);


router.post('/forgot-password', authController.ForgotPassword);
router.post('/reset-password/:token', authController.ResetPassword);


router.post(
  '/change-password', 
  authorizeRoles(UserRole.USER, UserRole.TRAINER, UserRole.ADMIN), 
  authController.ChangePassword
);

router.get(
    '/verify-user', 
    authorizeRoles(UserRole.USER), 
    authController.verifySession
);


router.post(
  '/trainer/re-apply', 
  authorizeRoles(UserRole.TRAINER), 
  upload.single('certificate'), 
  authController.ReApplyTrainer
);


router.post('/logout', authController.Logot);

router.get('/refresh-token', authController.RefreshToken);

router.post('/verify-user', authController.VerifyUserAccount);
router.post('/verify-trainer', authController.VerifyTrainerAccount);
router.post('/resend-otp', authController.ResendOtp);

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }), 
  (req: any, res) => {
    const { accessToken } = req.user;
    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`);
  }
);

export default router;