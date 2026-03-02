import { inject, injectable } from "tsyringe";
import { IServiceRepo } from "../../../domain/repositories/IServiceRepo";
import { IFetchServiceDetailsUseCase } from "../../interfaces/services/i-fetch-service-details.usecase";
import { ServiceDetailsResponseDTO } from "../../dto/services/service-details.dto";
import { AppError } from "../../../domain/errors/AppError";
import { HttpStatus } from "../../../utils/HttpStatus";
import { ServiceMapper } from "application/mappers/service-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class FetchServiceDetailsUseCase implements IFetchServiceDetailsUseCase {
  constructor(
    @inject("IServiceRepo") private readonly _serviceRepo: IServiceRepo
  ) {}

  async execute(serviceId: string): Promise<ServiceDetailsResponseDTO> {
    const service = await this._serviceRepo.findServiceById(serviceId);

    if (!service) {
      throw new AppError(ERROR_MESSAGES.SERVICE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return ServiceMapper.toServiceResponseDTO(service)
  }
}
