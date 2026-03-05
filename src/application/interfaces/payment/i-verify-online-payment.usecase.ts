import { VerifyOnlinePaymentRequestDTO } from "application/dto/payment/verify-online-payment.dto"

export interface IVeirfyOnlinePayment{
    execute(input:VerifyOnlinePaymentRequestDTO):Promise<boolean>
}