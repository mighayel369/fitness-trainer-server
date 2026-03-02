import { FetchServicesRequestDTO,FetchServicesResponseDTO } from "application/dto/services/fetch-all.service.dto"

export interface IFetchAllServicesUseCase{
    execute(input:FetchServicesRequestDTO):Promise<FetchServicesResponseDTO>
}