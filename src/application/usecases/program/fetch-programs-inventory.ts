import { inject, injectable } from "tsyringe";
import { IProgramRepo } from "domain/repositories/IProgramRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IFetchProgramInventory } from "application/interfaces/program/i-fetch-program-summary";
import { 
  FetchProgramInventoryRequestDTO, 
  FetchProgramInventoryResponseDTO 
} from "application/dto/programs/program-summary.dto";
import { ProgramMapper } from "application/mappers/program-mapper";

@injectable()
export class FetchProgramInventory implements IFetchProgramInventory{
  constructor(
    @inject("IProgramRepo")
    private _programRepository: IProgramRepo
  ) {}

  async execute(input: FetchProgramInventoryRequestDTO): Promise<FetchProgramInventoryResponseDTO> {
    const { currentPage, limit, searchQuery, filter } = input;

    if (currentPage <= 0 || limit <= 0) {
      throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
    }

    const { data, totalCount } = await this._programRepository.findProgramInventory(
      currentPage,
      limit,
      searchQuery || "",
      filter || {}
    );

    return {
      data: data.map(program => ProgramMapper.toProgramSummaryDTO(program)),
      total: Math.ceil(totalCount/limit)
    };
  }
}