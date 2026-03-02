import { PublicServiceListResponseDTO } from "application/dto/public/fetch-public.services.dto";

export interface IFetchPublicServiceUseCase{
    execute():Promise<PublicServiceListResponseDTO>
}