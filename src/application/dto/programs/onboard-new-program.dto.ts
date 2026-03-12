export interface OnboardProgramRequestDTO {
  name: string;
  description: string;
  duration: number;
  programPic?: Express.Multer.File;
}

