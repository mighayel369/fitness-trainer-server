
export interface FinalizeBookingRequestDTO {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
  bookingDetails: {
    trainerId: string;
    service: string;
    date: string;
    time: string;
    price: number;
  };
}