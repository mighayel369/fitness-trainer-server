import express from "express";
import { AdminController } from "Presentation/controllers/AdminController";
import { adminAuthMiddleware } from 'Presentation/middleware/adminAuthMiddleware';
import { container } from "tsyringe";
import { upload } from "Presentation/middleware/upload";
const adminController = container.resolve(AdminController);

const router=express.Router()


router.post('/login',adminController.login)
router.get('/users',adminAuthMiddleware,adminController.adminFindAllUser)
router.get('/trainers',adminController.adminFindAllTrainers)
router.patch('/user/status/:id',adminAuthMiddleware,adminController.updateUserStatus)
router.patch('/trainer/status/:id',adminAuthMiddleware,adminController.updateTrainerStatus)
router.get('/users/:id',adminAuthMiddleware,adminController.findUserDetails)
router.get('/trainers/:id',adminAuthMiddleware,adminController.findTrainerDetails)
router.get('/pending-trainers',adminAuthMiddleware,adminController.adminFindAllPendingTrainers)
router.patch('/verify-trainer-action/:id',adminAuthMiddleware,adminController.handleTrainerApproval)
router.post('/services/add',adminAuthMiddleware,upload.single("servicePic"),adminController.addNewService)
router.get("/services",adminAuthMiddleware,adminController.fetchServices);
router.patch("/services/:id",adminAuthMiddleware,upload.single("servicePic"),adminController.updateService);
router.get('/services/:id',adminAuthMiddleware,adminController.findServiceDetails)
router.delete('/services/:id',adminAuthMiddleware,adminController.deleteService)
router.get('/get-adminwallet',adminAuthMiddleware,adminController.fetchAdminWallet)
router.patch('/services/status/:id',adminAuthMiddleware,adminController.updateServiceStatus)
router.get('/dashboard',adminAuthMiddleware,adminController.fetchAdminDashboardData)
export default router


