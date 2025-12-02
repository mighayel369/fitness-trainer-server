import { ServiceEntity } from "domain/entities/ServiceEntity";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { IFindByIdUseCase } from "domain/usecases/IFindByIdUseCase";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindServiceByIdUseCase implements IFindByIdUseCase<ServiceEntity> {
  constructor(
    @inject("IServiceRepo") private _serviceRepo: IServiceRepo 
  ) {}
  async find(id: string): Promise<ServiceEntity | null> {
    return await this._serviceRepo.findById(id);
  }
}
