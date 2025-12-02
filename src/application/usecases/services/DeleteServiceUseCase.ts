import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { inject, injectable } from "tsyringe";
import { IFindByIdUAndDeleteUseCase } from "domain/usecases/IFindByIdAndDeleteUseCase";

@injectable()
export class DeleteServiceUseCase implements IFindByIdUAndDeleteUseCase {
  constructor(
    @inject("IServiceRepo") private _serviceRepo: IServiceRepo
  ) {}

  async delete(id: string): Promise<boolean> {
    return await this._serviceRepo.delete(id);
  }
}