import { WeeklyAvailabilityDTO } from "./trainer-slot-response.dto";

export interface UpdateTrainerAvailabilityRequestDTO {
  trainerId: string;
  availability: WeeklyAvailabilityDTO;
}