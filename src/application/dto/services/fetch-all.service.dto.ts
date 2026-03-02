import { PaginationInputDTO,PaginationOutputDTO } from "../common/PaginationDto";

export interface ServiceResponseDTO {
  serviceId: string;
  name: string;
  duration: number;
  description:string;
  servicePic: string;
  status: boolean;
  createdAt?: Date; 
}

export type FetchServicesRequestDTO = PaginationInputDTO;

export type FetchServicesResponseDTO = PaginationOutputDTO<ServiceResponseDTO>;