import { TrainerBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";

export interface IFetchBookingDetailsForTrainer{
    execute(bookingId:string):Promise<TrainerBookingDetailsResponseDTO>
}