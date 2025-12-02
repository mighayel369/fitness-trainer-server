import { ServiceEntity } from "domain/entities/ServiceEntity";

export const ServiceMapper = {
  toEntity(doc: any): ServiceEntity {
    return new ServiceEntity(
      doc._id!.toString(),
      doc.name,
      doc.description,
      doc.status
    );
  }
};