import { injectable, inject } from "tsyringe";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { IUpdateServiceUseCase } from "application/interfaces/services/i-update-service.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { UpdateServiceRequestDTO } from "application/dto/services/update.service.dto";
import { ServiceEntity } from "domain/entities/ServiceEntity";
@injectable()
export class UpdateServiceUseCase implements IUpdateServiceUseCase {
  constructor(
    @inject("IServiceRepo") private readonly _serviceRepo: IServiceRepo,
    @inject("ICloudinaryService") private readonly _cloudinaryService: ICloudinaryService
  ) {}

  async execute(input: UpdateServiceRequestDTO): Promise<void> {
    const { serviceId, file, name, description, duration } = input;
    
    let servicePicUrl: string | undefined;

    if (file) {
      const safeName = name ? name.toLowerCase().replace(/[^a-z0-9]/g, "-") : "service-update";
      servicePicUrl = await this._cloudinaryService.getServiceImageUrl(file, safeName);
    }

    const servicePayload = new ServiceEntity(
      serviceId,               
      name as string,      
      description as string,   
      duration as number, 
      servicePicUrl as string,  
    );

    const updated = await this._serviceRepo.updateService(servicePayload);

    if (!updated) {
      throw new AppError("Service not found", HttpStatus.NOT_FOUND);
    }
  }
}