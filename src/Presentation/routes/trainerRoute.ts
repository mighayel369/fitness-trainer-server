import express from "express";
import { TrainerController } from "Presentation/controllers/TrainerController";
import { upload } from "Presentation/middleware/upload";
import { trainerAuthMiddleware } from "Presentation/middleware/trainerAuthMiddleware";
import { container } from "tsyringe";

const trainerController = container.resolve(TrainerController);

const router=express.Router()

router.post('/create-trainer',upload.single('certificate'),trainerController.RegisterTrainer)
router.post('/login', trainerController.loginTrainer)

router.get('/verify-token', trainerAuthMiddleware, trainerController.verifyTrainer);
router.get('/get-trainer',trainerAuthMiddleware,trainerController.getTrainerDetails)
router.post('/re-apply',trainerAuthMiddleware,upload.single('certificate'),trainerController.reApplyTrainer)
router.post('/update',trainerAuthMiddleware,upload.single('certificate'),trainerController.updateTrainer)

router.post('/update-profilepic',trainerAuthMiddleware,upload.single('image'),trainerController.updateProfilePicture)
router.get('/get-slots',trainerAuthMiddleware,trainerController.getTrainerSlots)
router.put('/update-weeklyslots',trainerAuthMiddleware,trainerController.updateWeeklySlots)
router.get('/get-trainerwallet',trainerAuthMiddleware,trainerController.fetchTrainerWallet)
router.get('/bookings/pending',trainerAuthMiddleware,trainerController.getPending)
router.get('/bookings/all-bookings',trainerAuthMiddleware,trainerController.getAll)
router.get('/bookings/reschedule-requests',trainerAuthMiddleware,trainerController.getReschedules)
router.patch("/bookings/accept/:bookingId",trainerAuthMiddleware, trainerController.confirmBooking);
router.patch("/bookings/reject/:bookingId",trainerAuthMiddleware, trainerController.declineBooking);
router.patch("/booking/reschedule-action",trainerAuthMiddleware,trainerController.processReschedule)
router.get('/bookings/:bookingId',trainerAuthMiddleware,trainerController.getBookingDetails)

router.get('/dashboard',trainerAuthMiddleware,trainerController.getTrainerDashboardData)
router.get('/dashboard/appointment',trainerAuthMiddleware,trainerController.getTrainerDashboardAppointmentData)
export default router