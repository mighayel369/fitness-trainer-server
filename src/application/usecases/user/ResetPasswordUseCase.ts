import { inject, injectable } from "tsyringe";
import { IPasswordResetService } from "domain/services/IPasswordResetService";
import { IResetPasswordUseCase } from "domain/usecases/IResetPasswordUseCase";
@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase{
  constructor(
    @inject('IPasswordResetService') private _resetService: IPasswordResetService
  ) {}

  async sendPasswordLink(email: string): Promise<string> {
    return await this._resetService.generateResetToken(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; role?: string }> {
    return await this._resetService.resetPassword(token, newPassword);
  }
}
