import { inject, injectable } from "tsyringe";
import { IOtpService } from "domain/services/IOtpService";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ResendOtpRequestDTO } from "application/dto/public/resend-otp.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IReSendOtpUseCase } from "application/interfaces/public/i-resend-otp.usecase";

@injectable()
export class ReSendOtpUseCase implements IReSendOtpUseCase {
  constructor(
    @inject('IOtpService') private readonly _otpService: IOtpService
  ) {}

  async execute(input: ResendOtpRequestDTO): Promise<void> {
    const {email,role}=input
    const isSent = await this._otpService.sendOtp(email, role);

    if (!isSent) {
      throw new AppError("Failed to send OTP. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}