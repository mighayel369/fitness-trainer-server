import express from "express";
import { TrainerController } from "Presentation/controllers/TrainerController";
import { upload } from "Presentation/middleware/upload";
import { trainerAuthMiddleware } from "Presentation/middleware/trainerAuthMiddleware";
import { container } from "tsyringe";

const trainerController = container.resolve(TrainerController);

const router=express.Router()

router.post('/create-trainer',upload.single('certificate'),trainerController.createTrainer)
router.post('/login', trainerController.loginTrainer)

router.get('/verify-token', trainerAuthMiddleware, trainerController.verifyTrainer);
router.get('/get-trainer',trainerAuthMiddleware,trainerController.getTrainerDetails)
router.post('/re-apply',trainerAuthMiddleware,upload.single('certificate'),trainerController.reApplyTrainer)
router.post('/update',trainerAuthMiddleware,upload.single('certificate'),trainerController.updateTrainer)
router.get('/trainer-slots',trainerAuthMiddleware,trainerController.getTrainerSlots)

router.post('/update-profilepic',trainerAuthMiddleware,upload.single('image'),trainerController.updateProfilePicture)
export default router