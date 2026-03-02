import { inject,injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";
import { AppError } from "domain/errors/AppError";
import { IOtpService } from "domain/services/IOtpService";
import { UserRole } from "utils/Constants";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class VerifyUserAccountUseCase implements IVerifyAccountUseCase {
  constructor(
    @inject('IOtpService') private readonly _otpService: IOtpService,
    @inject('IUserRepo') private readonly _userRepo: IUserRepo,
    @inject("WalletRepo") private readonly _walletRepo: IWalletRepo,
  ) {}

  async execute(input: VerifyAccountRequestDTO): Promise<boolean> {
    const { email, otp } = input;

    const otpRecord = await this._otpService.verifyOtp(email, otp);
    if (!otpRecord || otpRecord.role !== UserRole.USER) {
      throw new AppError("Invalid OTP or unauthorized role", HttpStatus.BAD_REQUEST);
    }

    const user = await this._userRepo.findUserByEmail(email);
    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    await this._userRepo.updateUserStatus(user.userId,true)

    await this._walletRepo.createWallet(user.userId);

    return true;
  }
}