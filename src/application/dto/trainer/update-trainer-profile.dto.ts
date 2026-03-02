export interface UpdateTrainerProfileDTO {
  name: string;
  gender: string;
  experience: number;
  languages: string[];
  bio: string;
  phone: string;
  address: string;
  pricePerSession: number;
  services: string[]; 
}

export interface UpdateTrainerProfileRequestDTO{
       trainerId: string;
       data:UpdateTrainerProfileDTO;
}

export interface ReapplyTrainerDTO {
  name: string;
  gender: string;
  experience: number;
  services: string[]; 
  languages: string[];
  certificate: Express.Multer.File;
  pricePerSession:number
}

export interface ReapplyTrainerRequestDTO{
  trainerId:string,
  data:ReapplyTrainerDTO
}