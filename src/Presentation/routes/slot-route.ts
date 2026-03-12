import express from "express";
import { container } from "tsyringe";
import { SlotController } from "Presentation/controllers/slot-controller";
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";

const router = express.Router();
const slotController = container.resolve(SlotController);

router.get(
  '/schedule', 
  authorizeRoles(UserRole.TRAINER), 
  slotController.getTrainerSchedule
);

router.put(
  '/weekly-template', 
  authorizeRoles(UserRole.TRAINER), 
  slotController.syncWeeklyAvailability
);


router.post(
  '/browse-availability', 
  authorizeRoles(UserRole.USER), 
  slotController.fetchAvailableSlotsForBooking
);

export default router;