
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { CreateParamUser } from "domain/entities/UserEntity";
import { IRegisterUseCase } from "domain/usecases/IRegisterUseCase";
import { ERROR_MESSAGES } from "core/ErrorMessage";

@injectable()
export class UserRegisterUseCase implements IRegisterUseCase<CreateParamUser> {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo,
    @inject("IPasswordHasher") private readonly _passwordHasher: IPasswordHasher
  ) {}

  async execute(payload: CreateParamUser) {
    const userExist = await this._userRepo.findUserByEmail(payload.email);
    if (userExist) return { success: false, message: ERROR_MESSAGES.EMAIL_EXISTS };

    payload.password = await this._passwordHasher.hash(payload.password);
    const user = await this._userRepo.createUser(payload);

    return { success: true, email: user?.email };
  }
}
