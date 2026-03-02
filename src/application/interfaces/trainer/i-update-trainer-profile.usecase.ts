import { UpdateTrainerProfileRequestDTO } from "application/dto/trainer/update-trainer-profile.dto"

export interface IUpdateTrainerProfileUseCase{
    execute(input:UpdateTrainerProfileRequestDTO):Promise<void>
}