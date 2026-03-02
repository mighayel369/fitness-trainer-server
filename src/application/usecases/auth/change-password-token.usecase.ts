import { inject, injectable } from "tsyringe";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { IChangePasswordUseCase } from "../../interfaces/auth/i-change-password.usecase";
import { ResetPasswordTokenBasedDTO } from "application/dto/auth/change-password.dto";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ResetPasswordUseCase implements IChangePasswordUseCase<ResetPasswordTokenBasedDTO> {
  constructor(
    @inject("IUserRepo") private readonly userRepo: IUserRepo,
  ) {}

  async execute(input: ResetPasswordTokenBasedDTO): Promise<void> {
    const { token, newPassword } = input;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    const user = await this.userRepo.findByResetToken(hashedToken);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_RESET_LINK, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepo.updatePassword(user.userId, hashedPassword);
    await this.userRepo.updateResetToken(user.userId, undefined, undefined);
  }
}
