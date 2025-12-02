import { injectable, inject } from "tsyringe";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { IUpdatableProfile } from "domain/usecases/IUpdatableProfileUseCase";
import { ServiceEntity } from "domain/entities/ServiceEntity";
import { ERROR_MESSAGES } from "core/ErrorMessage";
@injectable()
export class UpdateServiceUseCase implements IUpdatableProfile<ServiceEntity>{
  constructor(
    @inject("IServiceRepo") private readonly _serviceRepo: IServiceRepo
  ) {}

 async updateData(id: string, data: Partial<ServiceEntity>, file?: Express.Multer.File): Promise<{ success: boolean; data?: ServiceEntity | undefined; message?: string; }> {
    const updated=await this._serviceRepo.update(id,data)
        if (!updated) {
          return { success: false, message: ERROR_MESSAGES.TRAINER_NOT_FOUND };
        }
    return {success:true,data:updated}
  }
}

