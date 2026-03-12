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
    dashboardController.getAdminPlatformInsights
);

router.get(
    "/trainer/metrics",
    authorizeRoles(UserRole.TRAINER),
    dashboardController.getTrainerPerformanceMetrics
);

router.get(
    "/trainer/agenda",
    authorizeRoles(UserRole.TRAINER),
    dashboardController.getTrainerDailyAgenda
);

export default router;