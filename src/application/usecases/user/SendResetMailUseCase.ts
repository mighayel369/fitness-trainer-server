import { inject, injectable } from "tsyringe";
import config from "config";
import { IOtpService } from "domain/services/IOtpService";
import { ISendResetMailUseCase } from "domain/usecases/ISendResetMailUseCase";

@injectable()
export class SendResetMailUseCase implements ISendResetMailUseCase {
  constructor(
    @inject("IOtpService") private readonly otpService: IOtpService
  ) {}

  async execute(email: string, token: string): Promise<boolean> {
    const resetLink = `${config.CLIENT_URL}/reset-password/${token}`;

    try {
      await this.otpService.sendResetEmail(email, resetLink);
      return true;
    } catch (error) {
      console.error(`[SendResetMailUseCase] Failed to send reset email:`, error);
      return false;
    }
  }
}
