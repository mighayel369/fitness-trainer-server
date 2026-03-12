import express from "express";
import { container } from "tsyringe";
import { BookingController } from "Presentation/controllers/booking-controller";
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";

const router = express.Router();
const bookingController = container.resolve(BookingController);


router.post('/checkout', 
    authorizeRoles(UserRole.USER), 
    bookingController.checkoutAndBook
);

router.get('/user/history', 
    authorizeRoles(UserRole.USER), 
    bookingController.getClientBookingHistory
);

router.get('/user/details/:id',
    authorizeRoles(UserRole.USER), 
    bookingController.clientSessionDetails
);

router.post('/reschedule/request', 
    authorizeRoles(UserRole.USER), 
    bookingController.requestSessionReschedule
);

router.delete('/:bookingId/cancel', 
    authorizeRoles(UserRole.USER), 
    bookingController.cancelSession
);


router.get('/trainer/history', 
    authorizeRoles(UserRole.TRAINER), 
    bookingController.trainerSessionHistory
);

router.get('/trainer/details/:bookingId', 
    authorizeRoles(UserRole.TRAINER), 
    bookingController.trainerSessionDetails
);

router.get('/trainer/pending', 
    authorizeRoles(UserRole.TRAINER), 
    bookingController.getPendingSessionRequests 
);

router.get('/trainer/reschedule-requests', 
    authorizeRoles(UserRole.TRAINER), 
    bookingController.getRescheduleRequests
);

router.patch('/pending/accept', 
    authorizeRoles(UserRole.TRAINER), 
    bookingController.acceptBookingRequest
);

router.patch('/pending/reject', 
    authorizeRoles(UserRole.TRAINER), 
    bookingController.rejectBookingRequest
);

router.patch('/reschedule/approve', 
    authorizeRoles(UserRole.TRAINER), 
    bookingController.acceptReschedule
);

router.patch('/reschedule/reject', 
    authorizeRoles(UserRole.TRAINER), 
    bookingController.declineReschedule
);

export default router;