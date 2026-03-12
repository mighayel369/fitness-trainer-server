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
    const booking = await this._bookingRepo.findBookingById(data.bookingId);
    if (!booking) throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);

    booking.requestReschedule(data.newDate, data.newTimeSlot);
    await this._bookingRepo.updateBooking(data.bookingId, booking);
}
}