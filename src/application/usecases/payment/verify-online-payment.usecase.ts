import { inject, injectable } from "tsyringe";
import { VerifyOnlinePaymentRequestDTO } from "application/dto/payment/verify-online-payment.dto";
import { IVeirfyOnlinePayment } from "application/interfaces/payment/i-verify-online-payment.usecase";
import { IPaymentService } from "domain/services/IPaymentService";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class VerifyOnlinePaymentUsecase implements IVeirfyOnlinePayment {
  constructor(
    @inject("IPaymentService") private _paymentService: IPaymentService
  ) {}

  async execute(input: VerifyOnlinePaymentRequestDTO): Promise<boolean> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = input;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
    }

    const isValid = this._paymentService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      throw new AppError(
        ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }
    return true;
  }
}