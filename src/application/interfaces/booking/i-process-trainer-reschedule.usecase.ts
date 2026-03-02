import { ProcessRescheduleRequestDTO } from "../../dto/booking/process-reschedule.dto";

export interface IProcessTrainerRescheduleUseCase {
  execute(data: ProcessRescheduleRequestDTO): Promise<void>;
}