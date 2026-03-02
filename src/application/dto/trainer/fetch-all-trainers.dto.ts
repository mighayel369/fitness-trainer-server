import { PaginationInputDTO,PaginationOutputDTO } from "../common/PaginationDto";
export interface FetchAllTrainersRequestDTO extends PaginationInputDTO{}

export interface TrainersResponseDTO {
  trainerId: string;
  name: string;
  email:string;
  status: boolean;
  pricePerSession:number;
}

export type FetchAllTrainersResponseDTO = PaginationOutputDTO<TrainersResponseDTO>;

export interface ClientTrainersResponseDTO extends TrainersResponseDTO{
  profilePic: string | null;
  rating: number;
  experience: number;
  address: string | null;
  serviceName: string; 
}

export type FetchAllClientTrainersResponseDTO = PaginationOutputDTO<ClientTrainersResponseDTO>;

export interface PendingTrainerResponseDTO extends Omit<TrainersResponseDTO,'status' | 'email'>{
  services:string[];
  gender:string
}

export type FetchAllPendingTrainersResponseDTO=PaginationOutputDTO<PendingTrainerResponseDTO>