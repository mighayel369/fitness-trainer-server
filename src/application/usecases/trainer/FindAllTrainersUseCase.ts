import { TrainerEntity } from "domain/entities/TrainerEntity";
import { IFindAllUseCase} from "domain/usecases/IFindAllUseCase";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IFindAllPendingTrainersUseCase } from "domain/usecases/IFindAllPendingTrainersUseCase";
@injectable()
export class FindAllTrainersUseCase implements IFindAllUseCase<TrainerEntity>,IFindAllPendingTrainersUseCase<TrainerEntity> {
  constructor(
    @inject("ITrainerRepo") private readonly trainerRepo: ITrainerRepo
  ) {}

  async findAll(page: number,limit: number,search?: string): Promise<{ data: TrainerEntity[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter = search ? { name: { $regex: search, $options: "i" },role:"trainer" } : {role:"trainer",verified:"accepted"};
    const { data, totalCount } = await this.trainerRepo.findMany(filter, limit, skip);

    const totalPages = Math.ceil(totalCount / limit);
    console.log(data)
    return { data: data, totalPages };
  }

  async findPendingTrainers(page: number,limit: number,search?: string): Promise<{ data: TrainerEntity[]; totalPages: number }> {
        const skip = (page - 1) * limit;
     const filter = search ? { name: { $regex: search, $options: "i" },role:"trainer" } : {role:"trainer",verified:"pending"};
     const { data, totalCount } = await this.trainerRepo.findMany(filter, limit, skip);
     console.log(data,totalCount)
     const totalPages = Math.ceil(totalCount / limit); 
     return { data: data, totalPages };
  }
}