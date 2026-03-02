import { UpdateTrainerAvailabilityRequestDTO } from "application/dto/slot/update-trainer-availability.dto";
export interface IUpdateTrainerWeeklyAvailabilityUseCase {
  execute(input: UpdateTrainerAvailabilityRequestDTO): Promise<void>;
}