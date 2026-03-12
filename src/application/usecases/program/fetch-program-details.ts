import { inject, injectable } from "tsyringe";
import { IProgramRepo } from "domain/repositories/IProgramRepo";
import { IFetchProgramDetails} from "application/interfaces/program/i-program-details";
import { ProgramDetailsResponseDTO } from "application/dto/programs/program-details.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ProgramMapper } from "application/mappers/program-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class FetchProgramDetails implements IFetchProgramDetails {
  constructor(
    @inject("IProgramRepo") private readonly _programRepo: IProgramRepo
  ) {}

  async execute(programId: string): Promise<ProgramDetailsResponseDTO> {
    const program = await this._programRepo.findProgramById(programId);

    if (!program) {
      throw new AppError(ERROR_MESSAGES.SERVICE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return ProgramMapper.toProgramSummaryDTO(program);
  }
}