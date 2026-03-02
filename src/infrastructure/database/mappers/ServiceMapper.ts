import { ServiceEntity } from "domain/entities/ServiceEntity";

export const ServiceMapper = {
  toEntity(doc: any): ServiceEntity {
    return new ServiceEntity(
      doc.serviceId,
      doc.name,
      doc.description,
      doc.duration,  
      doc.servicePic,
      doc.status
    );
  }
};