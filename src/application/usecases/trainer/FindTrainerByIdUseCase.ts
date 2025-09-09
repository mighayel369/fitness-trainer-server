import { IFindByIdUseCase } from "domain/usecases/IFindByIdUseCase";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IPendingTrainersUseCase } from "domain/usecases/IPendingTrainersUseCase";
@injectable()
export class FindTrainerByIdUseCase implements IFindByIdUseCase<TrainerEntity>,IPendingTrainersUseCase<TrainerEntity >{
  constructor(
    @inject("ITrainerRepo") private readonly trainerRepo: ITrainerRepo
  ) {}

  async find(id: string): Promise<TrainerEntity | null> {
    return this.trainerRepo.findTrainerById(id);
  }

  async findPendingTrainerDetails(id:string): Promise<TrainerEntity | null> {
      return this.trainerRepo.findPendingTrainerDetails(id)
  }
}
