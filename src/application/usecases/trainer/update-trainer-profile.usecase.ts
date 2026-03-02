import { injectable, inject } from "tsyringe";
import { IUpdateTrainerProfileUseCase } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UpdateTrainerProfileRequestDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ServiceEntity } from "domain/entities/ServiceEntity";
@injectable()
export class UpdateTrainerProfileUseCase implements IUpdateTrainerProfileUseCase {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo
  ) {}

  async execute(input: UpdateTrainerProfileRequestDTO): Promise<void> {
    const { trainerId, data } = input;
console.log(data)
    const existing = await this._trainerRepo.findTrainerById(trainerId);
    if (!existing) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
   const mappedServices: ServiceEntity[] = data.services 
      ? data.services.map(id => ({ serviceId: id } as ServiceEntity))
      : existing.services;
    const updatedEntity = new TrainerEntity(
      trainerId,
      data.name || existing.name,
      existing.email,
      existing.role,
      existing.verified,
      data.pricePerSession ?? existing.pricePerSession,
      existing.password,
      data.languages ?? existing.languages,
      data.experience ?? existing.experience,
      mappedServices,
      existing.certificate,
      data.gender ?? existing.gender,
      existing.rating,
      existing.status,
      existing.createdAt,
      data.bio ?? existing.bio,
      data.phone ?? existing.phone,
      data.address ?? existing.address,
      existing.rejectReason,
      existing.profilePic
    );

    if (updatedEntity.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    await this._trainerRepo.updateTrainer(trainerId, updatedEntity);
  }
}