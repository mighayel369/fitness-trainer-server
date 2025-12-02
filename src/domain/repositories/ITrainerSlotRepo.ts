import { TrainerSlotEntity } from "domain/entities/TrainerSlotEntity";

export interface ITrainerSlotRepo {
  find(trainerId: string, startDate?: string, endDate?: string): Promise<TrainerSlotEntity[] | null>;
}
