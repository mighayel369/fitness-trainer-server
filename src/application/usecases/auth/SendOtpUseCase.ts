import { IOtpService } from "domain/services/IOtpService";
import { inject, injectable } from "tsyringe";
import { ISendOtpUseCase } from "domain/usecases/ISendOtpUseCase";
@injectable()
export class SendOtpUseCase implements ISendOtpUseCase{
  constructor(@inject('IOtpService') private _otpService: IOtpService) {}

  async execute(email: string, role: string): Promise<boolean> {
    return await this._otpService.sendOtp(email, role);
  }
}
