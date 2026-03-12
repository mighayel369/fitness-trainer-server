
export interface BookSessionWithTrainerRequestDTO {
    userId: string;
    trainerId: string;
    program: string;
    date: string;
    time: string;
    price: number;
}

export interface OnlineBookingRequestDTO extends BookSessionWithTrainerRequestDTO {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}