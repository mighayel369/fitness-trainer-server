import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IInitiateOnlinePayment } from 'application/interfaces/payment/i-initiate-online-payment.usecase';
import { CreateOnlinePaymentRequestDTO, OnlinePaymentOrderResponseDTO } from 'application/dto/payment/online-payment.dto';
import { IVeirfyOnlinePayment } from 'application/interfaces/payment/i-verify-online-payment.usecase';
import { VerifyOnlinePaymentRequestDTO } from 'application/dto/payment/verify-online-payment.dto';
@injectable()
export class PaymentController{
    constructor(
    @inject("ICreateOrderUseCase") private _initiateOnlinePaymentUseCase:IInitiateOnlinePayment,
    @inject("IVerifyPaymentUseCase") private _verifyOnlinePaymentUseCase:IVeirfyOnlinePayment
    ){}

    initiateOnlinePayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const input: CreateOnlinePaymentRequestDTO = {
          trainerId: req.body.trainerId,
          serviceId: req.body.serviceId,
          date: req.body.date,
          time: req.body.time,
          amount: req.body.amount
        };
    
        const orderData:OnlinePaymentOrderResponseDTO = await this._initiateOnlinePaymentUseCase.execute(input);
    
        res.status(HttpStatus.OK).json({
          success: true,
          message:SUCCESS_MESSAGES.PAYMENT.PAYMENT_REQUEST_INITIATED,
          ...orderData
        });
      } catch (error) {
        next(error);
      }
    };

      verifyOnlinePayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const input: VerifyOnlinePaymentRequestDTO = {
          ...req.body
        };
    
        await this._verifyOnlinePaymentUseCase.execute(input);
        res.status(HttpStatus.OK).json({
          success: true,
          message:SUCCESS_MESSAGES.PAYMENT.PAYMENT_SUCCESS
        });
      } catch (error) {
        next(error);
      }
    };
}