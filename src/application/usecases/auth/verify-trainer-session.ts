import { TrainerSessionDTO } from "application/dto/auth/verify-session.dto";
import { IVerifySession } from "application/interfaces/auth/i-verify-session.usecase";
import { inject,injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { AuthMapper } from "application/mappers/auth-mapper";
@injectable()
export class VerifyTrainerSession implements IVerifySession<TrainerSessionDTO> {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
  ) {} 

  async execute(Id: string): Promise<TrainerSessionDTO> {
    const user = await this._trainerRepo.findTrainerById(Id);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if(!user.isBlocked){
        throw new AppError(ERROR_MESSAGES.USER_BLOCKED,HttpStatus.BAD_REQUEST)
    }

    return AuthMapper.toVerifyTrainerSessionResponseDTO(user);
  }
}