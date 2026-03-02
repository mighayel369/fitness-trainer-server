import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { ICancelBooking } from "application/interfaces/booking/i-cancel-booking.usecase";
import config from "config";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { BOOKING_STATUS } from "utils/Constants";
@injectable()
export class CancelUserBookingUseCase implements ICancelBooking{ 
  constructor(
    @inject("BookingRepo") private _bookingRepo: IBookingRepo,
    @inject("WalletRepo") private _walletRepo: IWalletRepo
  ) {}

  async execute(bookingId: string):Promise<void> {
    const booking = await this._bookingRepo.findBookingById(bookingId);

    if (!booking) throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    if (!booking.canCancel()) {
      throw new AppError(ERROR_MESSAGES.CANCELLATION_TIME_OVER, HttpStatus.BAD_REQUEST);
    }
    await this._walletRepo.releaseHoldWithoutBalance(booking.trainer.trainerId, bookingId);
    await this._walletRepo.releaseHoldWithoutBalance(config.ADMIN_WALLET, bookingId);

    await this._walletRepo.credit(
      booking.user.userId, 
      booking.totalAmount, 
      "refund", 
      bookingId
    );

    await this._bookingRepo.updateBookingStatus(bookingId, BOOKING_STATUS.CANCELED);
  }
}