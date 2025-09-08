import { inject, injectable } from "tsyringe";
import { IOtpService } from "domain/services/IOtpService";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IVerifyOtpUseCase } from "domain/usecases/IVerifyOtpUseCase";
@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase{
  constructor(
    @inject('IOtpService') private _otpService: IOtpService,
    @inject('IUserRepo') private _userRepo: IUserRepo
  ) {}

  async execute(email: string, otp: string): Promise<string | null> {
    const isValid = await this._otpService.verifyOtp(email, otp);
    if (isValid) {
      const updated = await this._userRepo.updateVerification(email);
      if (!updated) return null;
      return isValid.role;
    }
    return null;
  }
}
