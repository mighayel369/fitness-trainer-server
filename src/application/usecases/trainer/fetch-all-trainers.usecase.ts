import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { FetchAllTrainersRequestDTO,FetchAllTrainersResponseDTO } from "application/dto/trainer/fetch-all-trainers.dto";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { TrainerMapper } from "application/mappers/trainer-mapper";
@injectable()
export class FetchAllTrainersUseCase implements  IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO> {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo
  ) {}
async execute(input: FetchAllTrainersRequestDTO): Promise<FetchAllTrainersResponseDTO> {
  let {limit,currentPage,searchQuery,filter}=input
      if (currentPage <= 0 || limit <= 0) {
        throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
      }

      const { data, totalCount } = await this._trainerRepo.findAccepted(
      currentPage,
      limit,
      {searchQuery,...filter}
    );

    return {
      data:data.map(d=>TrainerMapper.toTrainerResponseDTO(d)),
      total:totalCount
    }
}
}

