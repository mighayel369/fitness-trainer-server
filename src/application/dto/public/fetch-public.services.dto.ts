import { ServiceResponseDTO } from "../services/fetch-all.service.dto";

export interface PublicServiceDTO extends Omit<ServiceResponseDTO, 'status' | 'duration' | 'createdAt'> {}

export interface PublicServiceListResponseDTO {
    data: PublicServiceDTO[];
}