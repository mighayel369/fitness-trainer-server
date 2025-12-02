import { ServiceEntity, CreateParamService } from "domain/entities/ServiceEntity";

export interface IServiceRepo {
  create(payload: CreateParamService): Promise<ServiceEntity>;
  fetchServices(page: number,limit: number,search?: string): Promise<{ services: ServiceEntity[]; totalPages: number }>;
  findById(id: string): Promise<ServiceEntity | null>;
  delete(id:string):Promise<boolean>
  update(id:string,data:Partial<ServiceEntity>):Promise<ServiceEntity|null>
 findMany(filter?: object,page?: number,limit?: number): Promise<{ data: ServiceEntity[]; totalCount: number }>;
}
