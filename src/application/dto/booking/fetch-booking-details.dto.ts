
export interface TrainerBookingDetailsResponseDTO {
    bookingId: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    clientProfilePic?: string;
    
    bookedService: string;
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
  
  bookedService: string;
  bookedDate: string;      
  bookedTime: string;    
  sessionDuration: number;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'reschedule_requested';

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