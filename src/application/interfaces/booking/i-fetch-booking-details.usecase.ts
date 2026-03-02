import { UserBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto"

export interface IFetchBookingDetailsForClient{
    execute(bookingId:string):Promise<UserBookingDetailsResponseDTO>
}