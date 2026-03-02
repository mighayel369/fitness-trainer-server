import { inject, injectable } from "tsyringe";
import crypto from 'crypto';
import config from "config";
import { ISendPasswordResetLinkUseCase } from "../../interfaces/auth/i-send-password-reset-link.usecase";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IOtpService } from "domain/services/IOtpService";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class SendPasswordResetLinkUseCase implements ISendPasswordResetLinkUseCase {
  constructor(
    @inject("IUserRepo") private readonly userRepo: IUserRepo,
    @inject("IOtpService") private readonly mailService: IOtpService
  ) {}

  async execute(email: string): Promise<void> {

    const user = await this.userRepo.findUserByEmail(email);
    
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = Date.now() + 1000 * 60 * 15; 

    await this.userRepo.updateResetToken(user.userId, hashedToken, expiry);

    const resetLink = `${config.CLIENT_URL}/reset-password/${rawToken}`;
    await this.mailService.sendResetEmail(email, resetLink);
  }
}