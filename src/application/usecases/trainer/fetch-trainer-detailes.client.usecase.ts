import { IFetchTrainerDetails } from "application/interfaces/trainer/i-fetch-trainer-details.usecase";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { UserTrainerViewDTO } from "application/dto/trainer/fetch-trainer-details.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerMapper } from "application/mappers/trainer-mapper";


@injectable()
export class FetchTrainerDetailsForClient implements IFetchTrainerDetails<UserTrainerViewDTO> {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo
  ) {}

  async execute(trainerId: string): Promise<UserTrainerViewDTO> {
    if(!trainerId){
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS,HttpStatus.BAD_REQUEST)
    }

    let trainer=await this._trainerRepo.findTrainerById(trainerId)
    if(!trainer){
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND,HttpStatus.NOT_FOUND)
    }

    return TrainerMapper.toUserTrainerViewDTO(trainer)
  }
}
