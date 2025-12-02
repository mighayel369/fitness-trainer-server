import { injectable, inject } from "tsyringe";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { ServiceEntity } from "domain/entities/ServiceEntity";
import { IFindAllUseCase } from "domain/usecases/IFindAllUseCase";

@injectable()
@injectable()
export class FetchServicesUseCase implements IFindAllUseCase<ServiceEntity>{
  constructor(@inject("IServiceRepo") private _serviceRepo: IServiceRepo) {}

  async findAll(page: number,limit: number,search?: string): Promise<{ data: ServiceEntity[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const { data, totalCount } = await this._serviceRepo.findMany(filter, limit, skip);

    const totalPages = Math.ceil(totalCount / limit);
    return { data: data, totalPages };
  }
}
