
import { IUpdateStatus } from "application/interfaces/common/i-update-status.usecase";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import logger from "utils/logger";
import { UserMapper } from "application/mappers/user-mapper";
import { UpdateStatusRequestDTO,UpdateStatusResponseDTO } from "application/dto/common/update-status.dto";import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class UpdateUserStatusUseCase implements IUpdateStatus {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo
  ) {}

  async execute(input: UpdateStatusRequestDTO): Promise<UpdateStatusResponseDTO> {
    const { id, isActive } = input;


    const user = await this._userRepo.findUserById(id);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info(`Admin action: Setting User ${id} active state to ${isActive}`);

    await this._userRepo.updateUserStatus(id, isActive);

    return UserMapper.toUpdateStatusResponseDTO(isActive)
  }
}