import { ReapplyTrainerRequestDTO } from "application/dto/trainer/update-trainer-profile.dto";

export interface IReapplyTrainer{
    execute(input:ReapplyTrainerRequestDTO):Promise<void>
}