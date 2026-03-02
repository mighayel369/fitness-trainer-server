import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class ProcessTrainerRescheduleUseCase implements IProcessTrainerRescheduleUseCase {
  constructor(
    @inject("BookingRepo") private readonly _bookingRepo: IBookingRepo
  ) {}

  async execute(data: ProcessRescheduleRequestDTO): Promise<void> {
    const { bookingId, action } = data;

    const booking = await this._bookingRepo.findBookingById(bookingId);
    if (!booking) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const actionHandlers: Record<string, () => void> = {
      approve: () => booking.approveReschedule(),
      reject: () => booking.rejectReschedule(),
    };

    const handler = actionHandlers[action];
    if (!handler) {
      throw new AppError(ERROR_MESSAGES.INVALID_ACTION(action), HttpStatus.BAD_REQUEST);
    }

    handler();
    await this._bookingRepo.updateBooking(booking.bookingId, booking);
  }
}