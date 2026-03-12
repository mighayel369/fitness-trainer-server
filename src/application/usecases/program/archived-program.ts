import { IProgramRepo } from "domain/repositories/IProgramRepo";
import { inject, injectable } from "tsyringe";
import { IArchiveProgram } from "application/interfaces/program/i-archive-program";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ArchiveProgram implements IArchiveProgram {
  constructor(
    @inject("IProgramRepo") private _programRepo: IProgramRepo
  ) {}

  async execute(programId: string): Promise<void> {
    const existingProgram = await this._programRepo.findProgramById(programId);
    
    if (!existingProgram) {
      throw new AppError(ERROR_MESSAGES.SERVICE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const result = await this._programRepo.archiveProgram(programId);

    if (!result) {
      throw new AppError(
        "Failed to archive the program. Please try again.", 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}