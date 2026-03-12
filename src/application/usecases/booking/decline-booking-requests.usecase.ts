
import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { IDeclineBookingUseCase } from "application/interfaces/booking/i-decline-booking-request.usecase";
import { AppError } from "domain/errors/AppError";
import config from "config";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";


@injectable()
export class DeclineBookingUseCase implements IDeclineBookingUseCase {
  constructor(
    @inject("BookingRepo") private _bookingRepo: IBookingRepo,
    @inject("WalletRepo") private _walletRepo: IWalletRepo
  ) {}

  async execute(bookingId: string, reason: string): Promise<void> {
  
    const booking = await this._bookingRepo.findBookingById(bookingId);

    if (!booking) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    if (!booking.canBeDeclined()) {
        throw new AppError(ERROR_MESSAGES.DECLINE_BOOKING_ERROR, HttpStatus.BAD_REQUEST);
    }

    await this._walletRepo.releaseHoldWithoutBalance(booking.trainerId, bookingId);
    await this._walletRepo.releaseHoldWithoutBalance(config.ADMIN_WALLET, bookingId);

    await this._walletRepo.credit(
      booking.userId,
      booking.totalAmount,
      "refund",
      bookingId
    );

    booking.decline(reason);

    await this._bookingRepo.updateBooking(bookingId, booking);
  }
}