import { CreateOnlinePaymentRequestDTO,OnlinePaymentOrderResponseDTO } from "application/dto/booking/online-payment.dto";

export interface IInitiateOnlinePayment{
    execute(input:CreateOnlinePaymentRequestDTO):Promise<OnlinePaymentOrderResponseDTO>
}