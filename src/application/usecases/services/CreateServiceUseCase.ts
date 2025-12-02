import { injectable, inject } from "tsyringe";
import { ICreateServiceUseCase } from "domain/usecases/ICreateServiceUseCase";
import { CreateParamService, ServiceEntity } from "domain/entities/ServiceEntity";
import { IServiceRepo } from "domain/repositories/IServiceRepo";

@injectable()
export class CreateServiceUseCase implements ICreateServiceUseCase<CreateParamService> {
  constructor(
    @inject("IServiceRepo") private readonly _serviceRepo: IServiceRepo
  ) {}

  async create(payload: CreateParamService): Promise<{ success: boolean; message?: string }> {
    await this._serviceRepo.create(payload);
    return { success: true, message: "New Service Created Successfully" };
  }
}
