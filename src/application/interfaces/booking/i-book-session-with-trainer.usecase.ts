import { OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";


export interface IBookSessionWithTrainer {
   bookSessionWithTrainer(input: OnlineBookingRequestDTO ): Promise<void>;
}
