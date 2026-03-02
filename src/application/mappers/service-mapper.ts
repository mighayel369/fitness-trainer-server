import { ServiceResponseDTO } from "application/dto/services/fetch-all.service.dto";
import { ServiceEntity } from "domain/entities/ServiceEntity";
import { ListUnlistResponseDTO } from "application/dto/services/list-unlist.service.dto";
import { PublicServiceDTO } from "application/dto/public/fetch-public.services.dto";
export class ServiceMapper {

  static toServiceResponseDTO(entity: ServiceEntity): ServiceResponseDTO {
    return {
serviceId: entity.serviceId,
      name: entity.name,
      description: entity.description,
      duration: entity.duration,
      servicePic: entity.servicePic,
      status: entity.status ?? true,
      createdAt: entity.createdAt
    };
  }
  static toListUnlistResponseDTO(entity:ServiceEntity):ListUnlistResponseDTO{
    return {
      status:entity.status?? false
    }
  }

  static toPublicServiceResponseDTO(entity:ServiceEntity):PublicServiceDTO{
    return {
      serviceId:entity.serviceId,
      name:entity.name,
      description:entity.description,
      servicePic:entity.servicePic
    }
  }
}