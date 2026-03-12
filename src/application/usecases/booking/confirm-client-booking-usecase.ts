import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { IConfirmBookingUseCase } from "application/interfaces/booking/i-confirm-booking.usecase";
import { AppError } from "domain/errors/AppError";
import config from "config";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { BOOKING_STATUS } from "utils/Constants";

@injectable()
export class ConfirmBookingUseCase implements IConfirmBookingUseCase {
  constructor(
    @inject("BookingRepo") private _bookingRepo: IBookingRepo,
    @inject("WalletRepo") private _walletRepo: IWalletRepo
  ) {}

  async execute(bookingId: string): Promise<void> {
    const booking = await this._bookingRepo.findBookingById(bookingId);
    
    if (!booking) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!booking.canBeConfirmed()) {
      throw new AppError(
        ERROR_MESSAGES.BOOKING_CONFIRMATION_FAILED(booking.status), 
        HttpStatus.BAD_REQUEST
      );
    }

    const trainerId = booking.trainerId; 
    
    if (!trainerId) {
      throw new AppError('Trainer information is missing from booking', HttpStatus.BAD_REQUEST);
    }

    await this._bookingRepo.updateBookingStatus(bookingId, BOOKING_STATUS.CONFIRMED);
    

    await this._walletRepo.convertHoldToBalance(trainerId, bookingId);

    await this._walletRepo.convertHoldToBalance(config.ADMIN_WALLET, bookingId);
  }
}