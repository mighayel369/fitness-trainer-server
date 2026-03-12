export interface ModifyProgramSpecsRequestDTO {
  programId: string;
  name?: string;
  description?: string;
  duration?: number;
  file?: Express.Multer.File;
}