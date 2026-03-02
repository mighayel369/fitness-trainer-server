import { inject, injectable } from "tsyringe";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IFetchAllServicesUseCase } from "application/interfaces/services/i-fetch-all-services.usecase";
import { FetchServicesRequestDTO, FetchServicesResponseDTO } from "application/dto/services/fetch-all.service.dto";
import { ServiceMapper } from "application/mappers/service-mapper";

@injectable()
export class FetchServicesUseCase implements IFetchAllServicesUseCase {
  constructor(
    @inject("IServiceRepo")
    private serviceRepository: IServiceRepo
  ) {}

  async execute(input: FetchServicesRequestDTO): Promise<FetchServicesResponseDTO> {
    const { currentPage, limit, searchQuery, filter } = input;

    if (currentPage <= 0 || limit <= 0) {
      throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
    }

    const { data, totalCount } = await this.serviceRepository.findAllServices(
      currentPage,
      limit,
      searchQuery || "",
      filter || {}
    );

    return {

      data: data.map(service => ServiceMapper.toServiceResponseDTO(service)),
      total: totalCount,

    };
  }
}