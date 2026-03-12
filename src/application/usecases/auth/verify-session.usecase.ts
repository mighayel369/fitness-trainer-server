import { ClientSessionDTO } from "application/dto/auth/verify-session.dto";
import { IVerifySession } from "application/interfaces/auth/i-verify-session.usecase";
import { inject,injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { AuthMapper } from "application/mappers/auth-mapper";
@injectable()
export class VerifyClientSession implements IVerifySession<ClientSessionDTO> {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo
  ) {} 

  async execute(userId: string): Promise<ClientSessionDTO> {
    const user = await this._userRepo.findUserById(userId);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if(!user.isBlocked){
        throw new AppError(ERROR_MESSAGES.USER_BLOCKED,HttpStatus.BAD_REQUEST)
    }

    return AuthMapper.toVerifySessionResponseDTO(user);
  }
}