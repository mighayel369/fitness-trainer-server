import { injectable, inject } from "tsyringe";
import { IProgramRepo } from "domain/repositories/IProgramRepo";
import { IModifyProgramSpecs } from "application/interfaces/program/i-modify-program-specs";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { ModifyProgramSpecsRequestDTO } from "application/dto/programs/modify-program-sepcs.dto";
@injectable()
export class ModifyProgramSpecs implements IModifyProgramSpecs {
  constructor(
    @inject("IProgramRepo") private readonly _programRepo: IProgramRepo,
    @inject("ICloudinaryService") private readonly _cloudinaryService: ICloudinaryService
  ) {}

  async execute(input: ModifyProgramSpecsRequestDTO): Promise<void> {
    const { programId, file, name, description, duration } = input;
    console.log(programId)
    const existingProgram = await this._programRepo.findProgramById(programId);
    if (!existingProgram) {
      throw new AppError("Program not found", HttpStatus.NOT_FOUND);
    }

    let newPicUrl = existingProgram.programPic;
    if (file) {
      const safeName = (name || existingProgram.name).toLowerCase().replace(/[^a-z0-9]/g, "-");
      newPicUrl = await this._cloudinaryService.getProgramImageUrl(file, safeName);
    }

    try {
      existingProgram.updateSpecifications(
        name, 
        description, 
        duration ? Number(duration) : undefined, 
        newPicUrl
      );

      const updated = await this._programRepo.updateProgramSpecs(existingProgram);

      if (!updated) {
        throw new AppError("Failed to persist updated program", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (domainError: any) {
      throw new AppError(domainError.message, HttpStatus.BAD_REQUEST);
    }
  }
}