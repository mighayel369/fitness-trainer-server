import { TrainerSlotEntity } from "domain/entities/TrainerSlotEntity";

export interface IFindTrainerSlotUseCase {
  findSlots(trainerId: string): Promise<{ date: string; slots: TrainerSlotEntity[] }[]>;
}
