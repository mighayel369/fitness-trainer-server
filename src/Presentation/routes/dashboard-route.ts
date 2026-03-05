import express from "express";
import { container } from "tsyringe";
import { DashboardController } from "Presentation/controllers/dashboard-controller";
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";

const router = express.Router();
const dashboardController = container.resolve(DashboardController);

router.get(
    "/admin",
    authorizeRoles(UserRole.ADMIN),
    dashboardController.fetchAdminDashboardData
);


router.get(
    "/trainer",
    authorizeRoles(UserRole.TRAINER),
    dashboardController.getTrainerDashboardData
);


router.get(
    "/trainer/appointments",
    authorizeRoles(UserRole.TRAINER),
    dashboardController.getTrainerDashboardAppointmentData
);

export default router;