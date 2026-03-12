import { ProgramEntity } from "domain/entities/ProgramEntity";

export interface IProgramRepo {
  saveProgram(payload: ProgramEntity): Promise<void>;
  
  findProgramInventory(
    page: number,
    limit: number,
    search: string,
    filters: Record<string, any>
  ): Promise<{ data: ProgramEntity[]; totalCount: number }>;

  findProgramById(id: string): Promise<ProgramEntity | null>;

  updateProgramSpecs(data: Partial<ProgramEntity>): Promise<ProgramEntity | null>;

  updateProgramVisibility(programId: string, status: boolean): Promise<ProgramEntity | null>;

  archiveProgram(programId: string): Promise<ProgramEntity>;

  findPublishedPrograms(): Promise<ProgramEntity[]>;
}