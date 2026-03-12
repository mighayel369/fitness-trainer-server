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
import { BookingResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
@injectable()
export class OnlineBookingUseCase 
    extends VerifyOnlinePaymentUsecase 
    implements IBookSessionWithTrainer {
    
    constructor(
        @inject("IPaymentService") paymentService: IPaymentService, 
        @inject("BookingRepo") private _bookingRepo: IBookingRepo,
        @inject("WalletRepo") private _walletRepo: IWalletRepo
    ) {
        super(paymentService); 
    }

async bookSessionWithTrainer(input: OnlineBookingRequestDTO): Promise<BookingResponseDTO> {
        
        const paymentData = BookingMapper.toPaymentVerificationDTO(input);
        await super.execute(paymentData); 

        const bookingData = BookingMapper.toBookingDetailsDTO(input);
        const bookingDate = new Date(bookingData.date);
    
        const isBooked = await this._bookingRepo.checkAvailability(
            bookingData.trainerId,
            bookingDate,
            bookingData.time
        );

        if (isBooked) throw new AppError(ERROR_MESSAGES.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);

        const bookingEntity = BookingMapper.toBookingEntity(bookingData);
        console.log('booking mapper',bookingEntity)
        let bookingSummary=await this._bookingRepo.createBooking(bookingEntity);
        if(!bookingSummary){
            throw new AppError('Booking Creation Got Faled',HttpStatus.BAD_REQUEST)
        }
        await this._walletRepo.holdAmount(bookingEntity.trainer as string,bookingEntity.bookingId, bookingEntity.trainerEarning);
        await this._walletRepo.holdAmount(config.ADMIN_WALLET, bookingEntity.bookingId, bookingEntity.adminCommission);
        return BookingMapper.toUserBookingsResponseDTO(bookingSummary)
    }
}