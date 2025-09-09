import { IVerificationUseCase } from "domain/usecases/IVerificationUseCase";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IOtpService } from "domain/services/IOtpService";
@injectable()
export class TrainerVerificationUseCase implements IVerificationUseCase<TrainerEntity>{
    constructor(@inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
               @inject("IOtpService") private _otpService: IOtpService){}

   async handleVerification(id: string, action: string, reason?: string): Promise<TrainerEntity|null> {
        const trainer = await this._trainerRepo.updateVerification(id, action, reason);
  if (!trainer) return null;

  if (action === "accept") {
    await this._otpService.sendEmail(
      trainer.email,
      "Congratulations! Your trainer verification was successful. You can now access your account.",
      "success"
    );
  } else {
    await this._otpService.sendEmail(
      trainer.email,
      `Unfortunately, your trainer verification was rejected. Reason: ${trainer.rejectReason}`,
      "error"
    );
  }

  return trainer;
    }
}