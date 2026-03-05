import express from "express";
import { container } from "tsyringe";
import { SlotController } from "Presentation/controllers/slot-controller";
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";


const router = express.Router();
const slotController = container.resolve(SlotController);


router.get(
  '/my-slots', 
  authorizeRoles(UserRole.TRAINER), 
  slotController.getOwnSlots
);

router.put(
  '/weekly-availability', 
  authorizeRoles(UserRole.TRAINER), 
  slotController.updateWeeklyAvailability
);


router.post(
  '/available-slots', 
  authorizeRoles(UserRole.USER), 
  slotController.fetchAvailableSlotsForUser
);

export default router