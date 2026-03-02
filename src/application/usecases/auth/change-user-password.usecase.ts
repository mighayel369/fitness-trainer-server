import { inject, injectable } from "tsyringe";
import { IChangePasswordUseCase } from "../../interfaces/auth/i-change-password.usecase";
import { ChangePasswordRequestDTO } from "application/dto/auth/change-password.dto";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ChangeUserPasswordUseCase implements IChangePasswordUseCase<ChangePasswordRequestDTO> {
  constructor(
    @inject("IUserRepo") private readonly userRepo: IUserRepo,
    @inject("IPasswordHasher") private readonly passwordHasher: IPasswordHasher
  ) {}
  async execute(input:ChangePasswordRequestDTO): Promise<void> {
    let {userId,oldPassword,newPassword}=input
    if (!oldPassword || !newPassword) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_MISSING, HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepo.findUserById(userId);

    if (!user || !user.password) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isMatch = await this.passwordHasher.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT, HttpStatus.UNAUTHORIZED);
    }

    const hashedNewPassword = await this.passwordHasher.hash(newPassword);
    await this.userRepo.updatePassword(userId, hashedNewPassword);
  }
}