import { CreateOnlinePaymentRequestDTO,OnlinePaymentOrderResponseDTO } from "application/dto/payment/online-payment.dto";

export interface IInitiateOnlinePayment{
    execute(input:CreateOnlinePaymentRequestDTO):Promise<OnlinePaymentOrderResponseDTO>
}