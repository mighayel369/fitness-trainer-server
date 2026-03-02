import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IPaymentService } from "domain/services/IPaymentService";
import { CreateOnlinePaymentRequestDTO, OnlinePaymentOrderResponseDTO } from "application/dto/booking/online-payment.dto";
import { AppError } from "domain/errors/AppError";

import { IInitiateOnlinePayment } from "application/interfaces/booking/i-initiate-online-payment.usecase";
import { BookingMapper } from "application/mappers/booking-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class InitiateOnlinePaymentUseCase implements IInitiateOnlinePayment{
  constructor(
    @inject("IPaymentService") private _paymentService: IPaymentService,
    @inject("BookingRepo") private _bookingRepo: IBookingRepo
  ) {}

  async execute(data: CreateOnlinePaymentRequestDTO): Promise<OnlinePaymentOrderResponseDTO> {

    const isBooked = await this._bookingRepo.checkAvailability(
      data.trainerId, 
      new Date(data.date), 
      data.time
    );

    if (isBooked) {
      throw new AppError(ERROR_MESSAGES.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);
    }


    const order = await this._paymentService.createOrder(data.amount);
    if(!order){
      throw new AppError(ERROR_MESSAGES.ORDER_CREATION_FAILED,HttpStatus.BAD_REQUEST)
    }
   return BookingMapper.toOnlineOrderResponseDTO(order)
  }
}