import { ProgramEntity } from "domain/entities/ProgramEntity";
import { IProgram } from "../models/ProgramModel";

export const ProgramMapper = {

  toEntity(doc: IProgram): ProgramEntity {
    return new ProgramEntity(
      doc.programId,
      doc.name,
      doc.description,
      doc.duration,  
      doc.programPic,
      doc.status,
      doc.isArchived
    );
  }
};