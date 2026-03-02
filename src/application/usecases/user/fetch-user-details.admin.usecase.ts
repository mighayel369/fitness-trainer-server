import { IFetchUserDetailsUseCase } from "application/interfaces/user/i-fetch-user-details.usecase";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { AdminUserDetailDTO } from "application/dto/user/user-details.dto";
import { UserMapper } from "application/mappers/user-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { inject,injectable } from "tsyringe";

@injectable()
export class FetchUserDetailsForAdmin implements IFetchUserDetailsUseCase<AdminUserDetailDTO> {
  constructor( @inject("IUserRepo") private readonly _userRepo: IUserRepo) {}

  async execute(userId: string): Promise<AdminUserDetailDTO> {
    const user = await this._userRepo.findUserById(userId);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND,HttpStatus.NOT_FOUND)
    }

    return UserMapper.toAdminDetailDTO(user);
  }
}