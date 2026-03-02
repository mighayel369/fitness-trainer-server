
import { ServiceEntity } from "domain/entities/ServiceEntity";

export interface IServiceRepo {
  createService(payload: ServiceEntity): Promise<void>;
  findAllServices(
    page: number,
    limit: number,
    search: string,
    filters: Record<string, any>
  ): Promise<{ data: ServiceEntity[]; totalCount: number }>;
  findServiceById(id: string): Promise<ServiceEntity | null>;
  updateService(data: Partial<ServiceEntity>): Promise<ServiceEntity | null>;
  updateServiceStatus(serviceId:string,status:boolean):Promise<ServiceEntity |null>
  deleteService(serviceId: string): Promise<ServiceEntity>;
  findPublicServices():Promise<ServiceEntity[]>
}