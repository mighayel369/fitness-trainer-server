import { inject, injectable } from "tsyringe";
import { IProgramRepo } from "domain/repositories/IProgramRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IExplorePrograms } from "application/interfaces/program/i-explore-programs";
import { ProgramMapper } from "application/mappers/program-mapper";
import { ExploreProgramsResponseDTO } from "application/dto/programs/program-summary.dto";

@injectable()
export class ExplorePrograms implements IExplorePrograms {
  constructor(
    @inject("IProgramRepo")
    private _programRepository: IProgramRepo
  ) {}

  async execute(): Promise<ExploreProgramsResponseDTO> {
    try {

      const programs = await this._programRepository.findPublishedPrograms();

      const mappedData = programs.map((program) => 
        ProgramMapper.toExploreProgramsDTO(program)
      );

      return {
        data: mappedData
      };
      
    } catch (error) {
      throw new AppError(
        "Unable to load programs at this time. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}