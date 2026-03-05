import { razorpayPayment } from "domain/services/types/razorpayPayment.type";
import { OnlinePaymentOrderResponseDTO } from "application/dto/payment/online-payment.dto";
import config from "config";
export class PaymentMapper{
          static toOnlineOrderResponseDTO(order:razorpayPayment):OnlinePaymentOrderResponseDTO{
        return {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: config.RAZORPAY_ID!
        };
        }
}