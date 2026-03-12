import { BookingEntity } from "domain/entities/BookingEntity";
import { TrainerMapper } from "./TrainerMapper";
import { UserMapper } from "./UserMapper";
import { IBooking } from "../models/BookingModel";


export const BookingMapper = {
  toEntity(doc: IBooking): BookingEntity {
    return new BookingEntity(
      doc.bookingId,
      UserMapper.toEntity(doc.user as any),
      TrainerMapper.toEntity(doc.trainer as any),
      doc.program,
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
      doc.rescheduleRequest ? {
      newDate: doc.rescheduleRequest.newDate,
      newTimeSlot: doc.rescheduleRequest.newTimeSlot,
      createdAt: (doc as any).updatedAt || new Date(),
    } : undefined,
      doc.rescheduleCount,
      doc.rejectReason
    );
  },
toPersistence(entity: BookingEntity): Partial<IBooking> {
    return {
      bookingId: entity.bookingId,
      user: entity.userId,       
      trainer: entity.trainerId,
      program: entity.program,
      date: entity.date,
      timeSlot: entity.timeSlot,
      duration: entity.duration,
      totalAmount: entity.totalAmount,
      adminCommission: entity.adminCommission,
      trainerEarning: entity.trainerEarning,
      status: entity.status,
      payment: {
        method: entity.payment.method,
        status: entity.payment.status
      },
      rescheduleRequest: entity.rescheduleRequest ? {
        newDate: entity.rescheduleRequest.newDate,
        newTimeSlot: entity.rescheduleRequest.newTimeSlot,
        requestedBy: (entity.rescheduleRequest as any).requestedBy || "user"
      } : undefined,
      rescheduleCount: entity.rescheduleCount || 0,
      rejectReason: entity.rejectReason
    };
  }
};
