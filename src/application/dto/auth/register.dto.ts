export interface RegisterResponseDTO {
  email: string;
}

export interface UserRegisterRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface TrainerRegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  gender: string;
  experience: number
  pricePerSession: number
  programs: string[];
  languages: string[];
  certificateUrl?:string
  role?:string,
  verified?:string
}