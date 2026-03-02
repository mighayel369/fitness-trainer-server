

import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { FetchAllTrainersRequestDTO,FetchAllClientTrainersResponseDTO } from "application/dto/trainer/fetch-all-trainers.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerMapper } from "application/mappers/trainer-mapper";
@injectable()
export class FetchAllClientTrainersUseCase implements IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO> {
  constructor(
    @inject("ITrainerRepo")
    private readonly _trainerRepo: ITrainerRepo
  ) {}

  async execute(input: FetchAllTrainersRequestDTO): Promise<FetchAllClientTrainersResponseDTO> {
    let { limit, currentPage, searchQuery, filter } = input;

    if (currentPage <= 0 || limit <= 0) {
      throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
    }

    const { data, totalCount } = await this._trainerRepo.findAccepted(
      currentPage,
      limit,
      { searchQuery, ...filter }
    );

    return {
      data: data.map(trainer => TrainerMapper.toClientTrainersResponseDTO(trainer)),
      total: totalCount
    };
  }
}