
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import {  TrainerEntity } from "domain/entities/TrainerEntity";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IReapplyTrainer } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { ReapplyTrainerRequestDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { ProgramEntity } from "domain/entities/ProgramEntity";
@injectable()
export class ReapplyTrainerUseCase implements IReapplyTrainer {
  constructor(
    @inject("ITrainerRepo") private readonly trainerRepo: ITrainerRepo,
    @inject("ICloudinaryService") private readonly cloudinaryService: ICloudinaryService
  ) {}

  async execute(input:ReapplyTrainerRequestDTO): Promise<void> {
    const {trainerId,data}=input
    console.log('reapplydata',data)
    const existing = await this.trainerRepo.findTrainerById(trainerId);
    if (!existing) {
      throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
    }
    let imageUrl=''

    if (data.certificate) {
      imageUrl = await this.cloudinaryService.getTrainerCertificateUrl(
        data.certificate,
        existing.email
      );
    }
   const mappedPrograms: ProgramEntity[] = data.programs 
      ? data.programs.map(id => ({ programId: id } as ProgramEntity))
      : existing.programs;
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
      mappedPrograms, 
      existing.certificate,
      data.gender ?? existing.gender,
      existing.rating,
      existing.status,
      existing.createdAt,
      existing.bio,
      existing.phone,
      existing.address,
      existing.rejectReason,
      existing.profilePic
    );

     await this.trainerRepo.updateTrainer(trainerId, updatedEntity);

  }
}