import { IRequestBookingRescheduleUseCase } from "application/interfaces/booking/i-request-booking-reschedule.usecase";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { inject, injectable } from "tsyringe";
import { AppError } from "domain/errors/AppError";
import { RescheduleRequestDTO } from "application/dto/booking/reschedule-request.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class RequestBookingRescheduleUseCase implements IRequestBookingRescheduleUseCase {
  constructor(
    @inject("BookingRepo") private readonly _bookingRepo: IBookingRepo
  ) {}

  async execute(data: RescheduleRequestDTO): Promise<void> {
    const { bookingId, newDate, newTimeSlot } = data;

    const booking = await this._bookingRepo.findBookingById(bookingId);
    
    if (!booking) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!booking.canReschedule()) {
      throw new AppError(
        ERROR_MESSAGES.RESCHEDULE_FAILED(booking.status), 
        HttpStatus.BAD_REQUEST
      );
    }

    await this._bookingRepo.rescheduleBooking(bookingId, {
      newDate,
      newTimeSlot,
    });

  }
}