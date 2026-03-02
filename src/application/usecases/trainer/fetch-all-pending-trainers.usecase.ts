import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { FetchAllPendingTrainersResponseDTO, FetchAllTrainersRequestDTO } from "application/dto/trainer/fetch-all-trainers.dto";
import { TrainerMapper } from "application/mappers/trainer-mapper";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
@injectable()
export class FetchAllPendingTrainers implements IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO> {
  constructor(
    @inject("ITrainerRepo")
    private readonly _trainerRepo: ITrainerRepo
  ) {}

  async execute(input:FetchAllTrainersRequestDTO): Promise<FetchAllPendingTrainersResponseDTO> {
        let { limit, currentPage, searchQuery, filter } = input;
    
        if (currentPage <= 0 || limit <= 0) {
          throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
        }
    
        const { data, totalCount } = await this._trainerRepo.findPending(
          currentPage,
          limit,
          { searchQuery, ...filter }
        );
    
        return {
          data: data.map(trainer => TrainerMapper.toPendingTrainersResponseDTO(trainer)),
          total: totalCount
        };
  }
}