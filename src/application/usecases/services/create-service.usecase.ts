import { injectable, inject } from "tsyringe";
import { randomUUID } from "crypto";
import { ServiceEntity } from "domain/entities/ServiceEntity";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { CreateServiceRequestDTO } from "application/dto/services/create.service.dto";
import { ICreateServiceUseCase } from "application/interfaces/services/i-create.service.usecase";
@injectable()
export class CreateServiceUseCase implements ICreateServiceUseCase {
  constructor(
    @inject("IServiceRepo") private readonly _serviceRepo: IServiceRepo,
    @inject("ICloudinaryService") private readonly _cloudinaryService: ICloudinaryService
  ) {}

  async execute(input: CreateServiceRequestDTO): Promise<void> {
    let servicePicUrl = "";

    if (input.servicePic) {
      const safeName = input.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      servicePicUrl = await this._cloudinaryService.getServiceImageUrl(
        input.servicePic,
        safeName
      );
    }

    const servicePayload = new ServiceEntity(
      randomUUID(),    
      input.name,           
      input.description,        
      Number(input.duration),  
      servicePicUrl,
      true           
    );

    await this._serviceRepo.createService(servicePayload);
  }
}