import express from "express";
import { UserController } from "Presentation/controllers/UserController";
import { authMiddleware } from "Presentation/middleware/authMiddleware";
import passport from 'passport';
import { container } from "tsyringe";
const userController = container.resolve(UserController)
const router=express.Router()
router.post('/create-user', userController.createUser);
router.post('/send-otp',userController.sendOtp)
router.post('/verify-otp',userController.verifyOtp)
router.post('/login', userController.login);
router.get('/nav',authMiddleware,userController.getUserData)
router.post('/forgot-password',userController.forgotPassword)
router.post('/reset-password/:token', userController.resetPassword)

router.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}))

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect: '/auth/google/failure',session:false}),(req,res)=>{
    const {accessToken}=req.user as any
    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`)
})

router.get('/auth/google/failure', (req, res) => {
  res.redirect('http://localhost:5173/login');
});

router.get('/verify-userToken',authMiddleware,userController.verifyUser)

router.get('/user-details',authMiddleware,userController.getFullUserData)
router.patch("/update-userdata",authMiddleware,userController.updateUserData);
router.post('/refresh-token',userController.refreshUserToken)
router.get('/list-trainers',authMiddleware,userController.listTrainers)

router.get("/trainer/:id",authMiddleware,userController.getTrainerById);
router.post('/logout',userController.logot)


export default router