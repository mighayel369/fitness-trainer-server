import { RescheduleRequestDTO } from "application/dto/booking/reschedule-request.dto";

export interface IRequestBookingRescheduleUseCase {
  execute(data: RescheduleRequestDTO): Promise<void>;
}