import { SlotEntity } from "domain/entities/SlotEntity";

export interface IGetTrainerSlotConfigurationUseCase {
  execute(trainerId: string): Promise<SlotEntity>;
}