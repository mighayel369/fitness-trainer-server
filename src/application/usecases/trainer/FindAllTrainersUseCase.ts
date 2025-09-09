import { TrainerEntity } from "domain/entities/TrainerEntity";
import { IFindAllUseCase, IPaginatedResult } from "domain/usecases/IFindAllUseCase";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IFindAllPendingTrainersUseCase } from "domain/usecases/IFindAllPendingTrainersUseCase";
@injectable()
export class FindAllTrainersUseCase implements IFindAllUseCase<TrainerEntity>,IFindAllPendingTrainersUseCase<TrainerEntity> {
  constructor(
    @inject("ITrainerRepo") private readonly trainerRepo: ITrainerRepo
  ) {}

  async findAll(page=1, search=''): Promise<IPaginatedResult<TrainerEntity>> {
    const trainers = await this.trainerRepo.findAllTrainers(page, search);
    const count = await this.trainerRepo.trainerCount(search);
    const totalPages = Math.max(1, Math.ceil(count / 5));

    return { data: trainers, totalPages };
  }

  async findPendingTrainers(): Promise<TrainerEntity[] | null> {
      return this.trainerRepo.findPendingTrainers()
  }
}