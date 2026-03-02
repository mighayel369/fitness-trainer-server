import { BookingEntity } from "domain/entities/BookingEntity";
import { TrainerMapper } from "./TrainerMapper";
import { UserMapper } from "./UserMapper";


export const BookingMapper = {
  toEntity(doc: any): BookingEntity {
    return new BookingEntity(
      doc.bookingId,
      UserMapper.toEntity(doc.user),
      TrainerMapper.toEntity(doc.trainer),
      doc.service,
      doc.date,
      doc.timeSlot,
      doc.duration,
      doc.totalAmount,
      doc.adminCommission,
      doc.trainerEarning,
      doc.status,
      {
        method: doc.payment.method,
        status: doc.payment.status,
      },
      doc.rescheduleRequest,
      doc.rescheduleCount,
      doc.rejectReason
    );
  },
};
