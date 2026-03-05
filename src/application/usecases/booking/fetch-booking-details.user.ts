
import { inject, injectable } from "tsyringe";
import { IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { AppError } from "domain/errors/AppError";
import { UserBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class FetchBookingDetailsForClient implements IFetchBookingDetails<UserBookingDetailsResponseDTO>{
    constructor(
        @inject("BookingRepo") private _bookingRepo: IBookingRepo
    ) {}

    async execute(bookingId: string): Promise<UserBookingDetailsResponseDTO> {
      console.log(bookingId)
        const booking = await this._bookingRepo.findBookingById(bookingId);
      console.log(booking)
        if (!booking) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return BookingMapper.toUserBookingDetailsDTO(booking);
    }
}