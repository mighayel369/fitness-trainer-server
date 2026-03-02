import express from "express";
import { UserController } from "Presentation/controllers/UserController";
import { authMiddleware } from "Presentation/middleware/authMiddleware";
import passport from 'passport';
import { container } from "tsyringe";
const userController = container.resolve(UserController)
import { upload } from "Presentation/middleware/upload";
const router=express.Router()
router.post('/create-user', userController.RegisterUser);
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
router.get('/list-trainers',userController.listTrainers)

router.get("/trainer/:id",userController.getTrainerById);
router.post('/logout',userController.logot)

router.post('/update-userprofilepic',authMiddleware,upload.single('image'),userController.updateProfilePicture)


router.post('/trainer-slots',authMiddleware,userController.fetchTrainerSlot)
router.get('/get-userwallet',authMiddleware,userController.fetchUserWallet)


router.get('/bookings',authMiddleware,userController.fetchUserBookings)

router.post("/change-password",authMiddleware,userController.changePassword);

router.post('/booking/create-order',authMiddleware,userController.initiatePayment)
router.post('/booking/verify-payment',authMiddleware,userController.verifyAndBookTrainer)
router.get('/bookings/:id',authMiddleware,userController.fetchBookingDetails)
router.post('/booking/reschedule',authMiddleware,userController.requestReschedule)
router.post('/booking/cancel/:bookingId',authMiddleware,userController.cancelBooking)
export default router