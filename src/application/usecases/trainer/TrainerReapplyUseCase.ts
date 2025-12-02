
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { ITrainerReapplyUseCase } from "domain/usecases/ITrainerReapplyUseCase";

@injectable()
export class TrainerReapplyUseCase implements ITrainerReapplyUseCase {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
    @inject("ICloudinaryService") private readonly _cloudinaryService: ICloudinaryService
  ) {}

  async execute(id: string, payload: any, file?: Express.Multer.File) {
    const trainer = await this._trainerRepo.findTrainerById(id);
    if (!trainer) return { success: false, message: "Trainer not found" };

    if (file) {
      payload.certificate = await this._cloudinaryService.getTrainerCertificateUrl(file, trainer.email);
    }

    payload.verified = "pending";

    const updatedTrainer = await this._trainerRepo.findTrainerByIdAndUpdate(id, payload);
    if (!updatedTrainer) return { success: false, message: "Failed to update trainer" };

    return { success: true, trainer: updatedTrainer };
  }
}
