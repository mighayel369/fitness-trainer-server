
import { BookingEntity } from "domain/entities/BookingEntity";
import { BookingResponseDTO,TrainserBookingResponseDTO,TrainerPendingBookingDTO,TrainerRescheduleRequestDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { TrainerBookingDetailsResponseDTO,UserBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { randomUUID } from "crypto";
import { BOOKING_STATUS } from "utils/Constants";
import config from "config";
import { razorpayPayment } from "domain/services/types/razorpayPayment.type";
import { UserEntity } from "domain/entities/UserEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { BookSessionWithTrainerRequestDTO,OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { VerifyOnlinePaymentRequestDTO } from "application/dto/payment/verify-online-payment.dto";
export class BookingMapper {

  static toPaymentVerificationDTO(input: OnlineBookingRequestDTO): VerifyOnlinePaymentRequestDTO {
    return {
      razorpay_order_id: input.razorpay_order_id,
      razorpay_payment_id: input.razorpay_payment_id,
      razorpay_signature: input.razorpay_signature
    };
  }

  static toBookingDetailsDTO(input: OnlineBookingRequestDTO): BookSessionWithTrainerRequestDTO {
    return {
      userId: input.userId,
      trainerId: input.trainerId,
      program: input.program,
      date: input.date,
      time: input.time,
      price: input.price
    };
  }
    static toUserBookingsResponseDTO(entity:BookingEntity):BookingResponseDTO{
        return {
            bookingId:entity.bookingId,
            bookedDate:entity.date.toISOString(),
            trainerName:entity.trainer.name,
            bookedProgram:entity.program,
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
      bookedProgram: entity.program,
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
        
        bookedProgram: entity.program,
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

static toUserBookingDetailsDTO(entity: BookingEntity): UserBookingDetailsResponseDTO {
  return {
    bookingId: entity.bookingId,
    bookedProgram: entity.program, 
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

    totalAmount: entity.totalAmount,
    payment: {
      method: entity.payment?.method || "online",
      status: entity.payment?.status || "hold",
    },
    rescheduleRequest: entity.rescheduleRequest 
      ? {
          newDate: entity.rescheduleRequest.newDate.toISOString(),
          newTimeSlot: entity.rescheduleRequest.newTimeSlot,
          status: entity.status, 
        }
      : undefined,
    rejectReason: entity.rejectReason
  };
}

    static toBookingEntity(data: BookSessionWithTrainerRequestDTO): BookingEntity {
      console.log('booking data',data)
    const totalAmount = data.price;
    const adminPercent = config.ADMIN_PERCENT || 0.1;
    const adminCommission = totalAmount * adminPercent;
    const trainerEarning = totalAmount - adminCommission;
    return new BookingEntity(
      randomUUID(),
      data.userId,
      data.trainerId,
      data.program,
      new Date(data.date),
      data.time,
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