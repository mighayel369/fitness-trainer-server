
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { JwtService } from "infrastructure/services/JwtService";
import { ILoginUseCase } from "domain/usecases/ILoginUseCase";
import { ERROR_MESSAGES } from "core/ErrorMessage";

@injectable()
export class UserLoginUseCase implements ILoginUseCase {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo,
    @inject("IPasswordHasher") private readonly _passwordHasher: IPasswordHasher
  ) {}

  async execute(email: string, password: string) {
    const user = await this._userRepo.findUserByEmail(email);
    if (!user) return { success: false, message: ERROR_MESSAGES.USER_NOT_FOUND };
    if (user.status === false) return { success: false, message: ERROR_MESSAGES.USER_BLOCKED };

    const isMatch = await this._passwordHasher.compare(password, user.password ?? "");
    if (!isMatch) return { success: false, message: ERROR_MESSAGES.PASSWORD_INCORRECT };

    const accessToken = JwtService.generateAccessToken({ id: String(user._id), email: user.email, role: "user" });
    const refreshToken = JwtService.generateRefreshToken({ id: String(user._id), email: user.email, role: "user" });

    return { success: true, accessToken, refreshToken };
  }
}
