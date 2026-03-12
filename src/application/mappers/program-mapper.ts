import { ProgramSummaryDTO, ExploreProgramsDTO } from "application/dto/programs/program-summary.dto";
import { ProgramEntity } from "domain/entities/ProgramEntity";
import { ToggleProgramVisibilityResponseDTO } from "application/dto/programs/toggle-program-visibility.dto";

export class ProgramMapper {

  static toProgramSummaryDTO(entity: ProgramEntity): ProgramSummaryDTO {
    return {
      programId: entity.programId,
      name: entity.name,
      description: entity.description,
      duration: entity.duration,
      programPic: entity.programPic,
      isPublished: entity.status ?? true
    };
  }

  static toVisibilityResponseDTO(entity: ProgramEntity): ToggleProgramVisibilityResponseDTO {
    return {
      isPublished: entity.status ?? false
    };
  }


  static toExploreProgramsDTO(entity: ProgramEntity): ExploreProgramsDTO {
    return {
      programId: entity.programId,
      name: entity.name,
      description: entity.description,
      programPic: entity.programPic
    };
  }
}