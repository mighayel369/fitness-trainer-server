
import { IUpdateStatus } from "application/interfaces/common/i-update-status.usecase";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import logger from "utils/logger";
import { UpdateStatusRequestDTO,UpdateStatusResponseDTO } from "application/dto/common/update-status.dto";import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { TrainerMapper } from "application/mappers/trainer-mapper";
@injectable()
export class UpdateTrainerStatusUseCase implements IUpdateStatus {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo
  ) {}

  async execute(input: UpdateStatusRequestDTO): Promise<UpdateStatusResponseDTO> {
    const { id, isActive } = input;


    const trainer = await this._trainerRepo.findTrainerById(id);
    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    logger.info(`Admin action: Setting User ${id} active state to ${isActive}`);

    await this._trainerRepo.updateTrainerStatus(id, isActive);
    return TrainerMapper.toUpdateStatusResponseDTO(isActive)
  }
}