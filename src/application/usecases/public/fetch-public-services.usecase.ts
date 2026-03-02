import { inject,injectable } from "tsyringe";
import { IFetchPublicServiceUseCase } from "application/interfaces/public/i-fetch-public-services.usecase";
import { PublicServiceListResponseDTO } from "application/dto/public/fetch-public.services.dto";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { ServiceMapper } from "application/mappers/service-mapper";
import { ServiceEntity } from "domain/entities/ServiceEntity";
@injectable()
export class FetchPublicServiceUseCase implements IFetchPublicServiceUseCase{
          constructor(@inject("IServiceRepo") private _serviceRepository: IServiceRepo) {}

    async execute(): Promise<PublicServiceListResponseDTO> {
        let data=await this._serviceRepository.findPublicServices()
        return {
           data: data.map(service=> ServiceMapper.toServiceResponseDTO(service)),
        }
    }
}