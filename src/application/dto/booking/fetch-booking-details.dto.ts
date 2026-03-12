import { BOOKING_STATUS } from "utils/Constants";

export interface TrainerBookingDetailsResponseDTO {
    bookingId: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    clientProfilePic?: string;
    
    bookedProgram: string;
    bookedDate: Date;
    bookedTime: string;
    sessionDuration: number;
    
    bookingStatus: string;
    totalAmount: number;
    trainerEarning: number;
    paymentStatus: string;
    paymentMethod: string;

    rescheduleRequest?: {
        newDate: Date;
        newTimeSlot: string;
        requestedAt: Date;
    };
    rejectReason?:string
}


export interface UserBookingDetailsResponseDTO {
  bookingId: string;    
  
  bookedProgram: string;
  bookedDate: string;      
  bookedTime: string;    
  sessionDuration: number;
  bookingStatus: BOOKING_STATUS

  trainerId: string;   
  trainerName: string;
  trainerProfilePic?: string;
  trainerExperience: number;
  trainerGender: string;

  totalAmount: number;   
  payment: {
    method: string;     
    status: string;       
  };


  rescheduleRequest?: {
    newDate: string;
    newTimeSlot: string;
    status: string;
  };
   rejectReason?:string
}