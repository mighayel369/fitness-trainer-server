export interface CreateOnlinePaymentRequestDTO {
  trainerId: string;
  serviceId: string;
  date: string;
  time: string;
  amount: number;
}

export interface OnlinePaymentOrderResponseDTO {
  orderId: string;
  amount: string|number;
  currency: string;
  key: string;
}

export interface VerifyPaymentRequestDTO {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingDetails: {
    trainerId: string;
    service: string;
    date: string;
    time: string;
    price: number;
  };
}