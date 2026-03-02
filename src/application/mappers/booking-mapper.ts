
import { BookingEntity } from "domain/entities/BookingEntity";
import { BookingResponseDTO,TrainserBookingResponseDTO,TrainerPendingBookingDTO,TrainerRescheduleRequestDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { TrainerBookingDetailsResponseDTO,UserBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { OnlinePaymentOrderResponseDTO } from "application/dto/booking/online-payment.dto";
import { randomUUID } from "crypto";
import { BOOKING_STATUS } from "utils/Constants";
import config from "config";
import { razorpayPayment } from "domain/services/types/razorpayPayment.type";
import { FinalizeBookingRequestDTO } from "application/dto/booking/finalize-booking.dto";
import { UserEntity } from "domain/entities/UserEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
export class BookingMapper {
    static toUserBookingsResponseDTO(entity:BookingEntity):BookingResponseDTO{
        return {
            bookingId:entity.bookingId,
            bookedDate:entity.date.toISOString(),
            trainerName:entity.trainer.name,
            bookedService:entity.service,
            bookedTime:entity.timeSlot,
            bookingStatus:entity.status,
            sessionAmount:entity.totalAmount
        }
    }
    static toTrainerBookingsResponseDTO(entity: BookingEntity): TrainserBookingResponseDTO {
    return {
      bookingId: entity.bookingId,
      clientName: entity.user.name,
      clientEmail: entity.user.email,
      bookedService: entity.service,
      bookedDate: entity.date.toISOString(),
      bookedTime: entity.timeSlot,
      bookingStatus: entity.status,
      sessionAmount: entity.totalAmount,
    };
  }

  static toTrainerPendingResponseDTO(entity: BookingEntity): TrainerPendingBookingDTO {
    return {
      ...this.toTrainerBookingsResponseDTO(entity),
      paymentMethod: entity.payment.method,
      paymentStatus: entity.payment.status,
    };
  }

  static toTrainerRescheduleRequestsDTO(entity: BookingEntity): TrainerRescheduleRequestDTO {
    return {
      ...this.toTrainerBookingsResponseDTO(entity),
      requestedNewDate: entity.rescheduleRequest?.newDate.toISOString() || "",
      requestedNewTime: entity.rescheduleRequest?.newTimeSlot || "",
    };
  }

  static toTrainerBookingDetailsDTO(entity: BookingEntity): TrainerBookingDetailsResponseDTO {
    return {
        bookingId: entity.bookingId,
        clientName: entity.user.name,
        clientEmail: entity.user.email,
        clientPhone: entity.user.phone||'',
        clientProfilePic: entity.user.profilePic||'',
        
        bookedService: entity.service,
        bookedDate: entity.date,
        bookedTime: entity.timeSlot,
        sessionDuration: entity.duration,
        
        bookingStatus: entity.status,
        totalAmount: entity.totalAmount,
        trainerEarning: entity.trainerEarning,
        paymentStatus: entity.payment.status,
        paymentMethod: entity.payment.method,

        rescheduleRequest: entity.rescheduleRequest ? {
            newDate: entity.rescheduleRequest.newDate,
            newTimeSlot: entity.rescheduleRequest.newTimeSlot,
            requestedAt: entity.rescheduleRequest.createdAt
        } : undefined,
        rejectReason:entity.rejectReason
    };
}

   static toUserBookingDetailsDTO(entity: any): UserBookingDetailsResponseDTO {
    return {
   
      bookingId: entity.bookingId,

      bookedService: entity.serviceName || entity.category, 
      bookedDate: entity.date instanceof Date 
        ? entity.date.toISOString() 
        : entity.date,
      bookedTime: entity.timeSlot,
      sessionDuration: entity.duration || 60,
    
      bookingStatus: entity.status,

      trainerId: entity.trainer.trainerId,
      trainerName: entity.trainer.name || "Professional Trainer",
      trainerProfilePic: entity.trainer.profilePic || "",
      trainerExperience: entity.trainer.experience || 0,
      trainerGender: entity.trainer.gender || "Not Specified",

      totalAmount: entity.price || entity.totalAmount,
      payment: {
        method: entity.paymentMethod || entity.payment?.method || "Online",
        status: entity.paymentStatus || entity.payment?.status || "pending",
      },

      rescheduleRequest: entity.reschedule 
        ? {
            newDate: entity.reschedule.date.toISOString(),
            newTimeSlot: entity.reschedule.slot,
            status: entity.reschedule.status,
          }
        : undefined,
      rejectReason:entity.rejectReason
    };
  }
      static toOnlineOrderResponseDTO(order:razorpayPayment):OnlinePaymentOrderResponseDTO{
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: config.RAZORPAY_ID!
    };
    }


    static toEntityFromPayment(data: FinalizeBookingRequestDTO): BookingEntity {
    const totalAmount = data.bookingDetails.price;
    const adminPercent = config.ADMIN_PERCENT || 0.1;
    
    const adminCommission = totalAmount * adminPercent;
    const trainerEarning = totalAmount - adminCommission;
      const user={userId:data.userId} as UserEntity
      const trainer={trainerId:data.bookingDetails.trainerId} as TrainerEntity
    return new BookingEntity(
      randomUUID(),
      user,
      trainer,
      data.bookingDetails.service,
      new Date(data.bookingDetails.date),
      data.bookingDetails.time,
      60, 
      totalAmount,
      adminCommission,
      trainerEarning,
      BOOKING_STATUS.PENDING,
      {
        method: "online",
        status: "paid"
      }
    );
  }
}