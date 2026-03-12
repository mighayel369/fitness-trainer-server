import { PaginationInputDTO } from "../common/PaginationDto"
import { PaginationOutputDTO } from "../common/PaginationDto"
export interface BookingResponseDTO{
    bookingId:string,
    trainerName:string,
    bookedDate:string,
    bookedTime:string,
    bookedProgram:string,
    sessionAmount:number,
    bookingStatus:string
}

export interface FetchAllUserBookingRequestDTO extends PaginationInputDTO{
    userId:string
}

export interface FetchAllUserBookingsResponseDTO extends PaginationOutputDTO<BookingResponseDTO>{}

export interface TrainserBookingResponseDTO{
  bookingId: string;
  clientName: string;
  clientEmail: string;
  bookedProgram: string;
  bookedDate: string;
  bookedTime: string;
  sessionAmount: number;
  bookingStatus: string;
}


export interface TrainerPendingBookingDTO extends  TrainserBookingResponseDTO {
  paymentMethod: string;
  paymentStatus: string;
}

export interface TrainerRescheduleRequestDTO extends  TrainserBookingResponseDTO {
  requestedNewDate: string;
  requestedNewTime: string;
}


export interface FetchAllTrainerBookingRequestDTO extends PaginationInputDTO{
    trainerId:string
}

export interface FetchAllTrainerBookingsResponseDTO extends PaginationOutputDTO<TrainserBookingResponseDTO>{}
export interface FetchAllTrainerPendingBookingsResponseDTO extends PaginationOutputDTO<TrainerPendingBookingDTO>{}
export interface FetchAllTrainerRescheduleBookingsResponseDTO extends PaginationOutputDTO<TrainerRescheduleRequestDTO>{}