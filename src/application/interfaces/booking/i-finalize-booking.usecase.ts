
import { FinalizeBookingRequestDTO } from "application/dto/booking/finalize-booking.dto"
export interface IFinalizeBookingUseCase{
    execute(input:FinalizeBookingRequestDTO):Promise<void>
}