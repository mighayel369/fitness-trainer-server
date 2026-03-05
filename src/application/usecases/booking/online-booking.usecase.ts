import { inject, injectable } from "tsyringe";
import { OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { VerifyOnlinePaymentUsecase } from "../payment/verify-online-payment.usecase";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import config from "config";
import { IPaymentService } from "domain/services/IPaymentService";
import { IBookSessionWithTrainer } from "application/interfaces/booking/i-book-session-with-trainer.usecase";
@injectable()
export class OnlineBookingUseCase 
    extends VerifyOnlinePaymentUsecase 
    implements IBookSessionWithTrainer {
    
    constructor(
        @inject("IPaymentService") paymentService: IPaymentService, 
        @inject("BookingRepo") private _bookingRepo: IBookingRepo,
        @inject("IWalletRepo") private _walletRepo: IWalletRepo
    ) {
        super(paymentService); 
    }

    async bookSessionWithTrainer(input: OnlineBookingRequestDTO): Promise<void> {

        await super.execute(input); 

        const isBooked = await this._bookingRepo.checkAvailability(
            input.trainerId,
            new Date(input.date),
            input.time
        );
        
        if (isBooked) {
            throw new AppError(ERROR_MESSAGES.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);
        }


        const bookingEntity = BookingMapper.toBookingEntityFomOnlinePayment(input);
        await this._bookingRepo.createBooking(bookingEntity);


        await this._walletRepo.holdAmount(
            input.trainerId, 
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