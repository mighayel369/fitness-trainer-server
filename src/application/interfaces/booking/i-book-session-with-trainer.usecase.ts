import { OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { BookingResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";

export interface IBookSessionWithTrainer {
   bookSessionWithTrainer(input: OnlineBookingRequestDTO ): Promise<BookingResponseDTO>;
}
