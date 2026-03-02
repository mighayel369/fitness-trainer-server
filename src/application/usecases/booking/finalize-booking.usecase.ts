import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IPaymentService } from "domain/services/IPaymentService";
import { IFinalizeBookingUseCase } from "application/interfaces/booking/i-finalize-booking.usecase";
import { AppError } from "domain/errors/AppError";
import config from "config";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { FinalizeBookingRequestDTO } from "application/dto/booking/finalize-booking.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class FinalizeBookingUseCase implements IFinalizeBookingUseCase {
  constructor(
    @inject("BookingRepo") private _bookingRepo: IBookingRepo,
    @inject("IPaymentService") private _paymentService: IPaymentService,
    @inject("WalletRepo") private readonly _walletRepo: IWalletRepo
  ) {}

  async execute(data: FinalizeBookingRequestDTO): Promise<void> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = data;

    const isValid = this._paymentService.verifySignature(
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature
    );
    if (!isValid) throw new AppError(ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED,HttpStatus.BAD_REQUEST);

    const isBooked = await this._bookingRepo.checkAvailability(
      bookingDetails.trainerId,
      new Date(bookingDetails.date),
      bookingDetails.time
    );
    if (isBooked) throw new AppError(ERROR_MESSAGES.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);

    const bookingEntity = BookingMapper.toEntityFromPayment(data);

    await this._bookingRepo.createBooking(bookingEntity);
    
    await this._walletRepo.holdAmount(
      bookingDetails.trainerId, 
      bookingEntity.bookingId, 
      bookingEntity.trainerEarning
    );
    await this._walletRepo.holdAmount(
      config.ADMIN_WALLET, 
      bookingEntity.bookingId, 
      bookingEntity.adminCommission
    );
  }
}