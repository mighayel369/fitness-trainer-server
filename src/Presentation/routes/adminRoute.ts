import express from "express";
import { AdminController } from "Presentation/controllers/AdminController";
import { adminAuthMiddleware } from 'Presentation/middleware/adminAuthMiddleware';
import { container } from "tsyringe";
const adminController = container.resolve(AdminController);

const router=express.Router()


router.post('/login',adminController.adminLogin)
router.get('/users',adminAuthMiddleware,adminController.adminFindAllUser)
router.get('/trainers',adminAuthMiddleware,adminController.adminFindAllTrainers)
router.patch('/users/status/:id',adminAuthMiddleware,adminController.updateUserData)
router.get('/users/:id',adminAuthMiddleware,adminController.findUserDetails)
router.get('/trainers/:id',adminAuthMiddleware,adminController.findTrainerDetails)
router.get('/pending-trainers',adminController.getPendingTrainers)
router.get('/verify-trainer/:id',adminAuthMiddleware,adminController.getSinglePendingTrainer)
router.patch('/verify-trainer-action/:id',adminAuthMiddleware,adminController.handleTrainerVerification)
router.post('/services/add',adminAuthMiddleware,adminController.addNewService)
router.get("/services",adminController.fetchServices);
router.patch("/services/:id",adminAuthMiddleware,adminController.updateService);
router.get("/dashboard",adminAuthMiddleware,adminController.getDashboardData);
router.get('/services/:id',adminAuthMiddleware,adminController.findServiceDetails)
router.delete('/services/:id',adminAuthMiddleware,adminController.deleteService)
export default router