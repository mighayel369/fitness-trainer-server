import { inject, injectable } from "tsyringe";
import { IUpdatableProfile } from "domain/usecases/IUpdatableProfileUseCase";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ERROR_MESSAGES } from "core/ErrorMessage";
import { ICloudinaryService } from "domain/services/ICloudinaryService";

@injectable()
export class TrainerProfileUseCase implements IUpdatableProfile<TrainerEntity> {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
    @inject("ICloudinaryService") private readonly _cloudinary: ICloudinaryService
  ) {}

  async updateData(
    id: string,
    data: Partial<TrainerEntity>,
    file?: Express.Multer.File,
  ) {
    const existing = await this._trainerRepo.findTrainerById(id);
    if (!existing) {
      return { success: false, message: ERROR_MESSAGES.TRAINER_NOT_FOUND };
    }

    if (file ) {
      await this._cloudinary.deleteTrainerCertificate(`trainer-${existing.email}`);
      existing.certificate = await this._cloudinary.getTrainerCertificateUrl(file, existing.email)
      data.certificate=await this._cloudinary.getTrainerCertificateUrl(file, existing.email);
      }

    const updated = await this._trainerRepo.findTrainerByIdAndUpdate(id, data);

    if (!updated) {
      return { success: false, message: ERROR_MESSAGES.TRAINER_NOT_FOUND };
    }

    return { success: true, data: updated };
  }
}
