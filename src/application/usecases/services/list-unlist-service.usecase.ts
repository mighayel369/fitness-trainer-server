import { injectable, inject } from "tsyringe";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { IListUnlistServiceUseCase } from "application/interfaces/services/i-list-unlist.service.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ListUnlistRequestDTO ,ListUnlistResponseDTO} from "application/dto/services/list-unlist.service.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ServiceMapper } from "application/mappers/service-mapper";
@injectable()
export class ListUnlistServiceUseCase implements IListUnlistServiceUseCase {
  constructor(
    @inject("IServiceRepo") private readonly _serviceRepo: IServiceRepo
  ) {}

  async execute(input: ListUnlistRequestDTO): Promise<ListUnlistResponseDTO> {
    const { serviceId, status } = input;
    
    const service=await this._serviceRepo.updateServiceStatus(serviceId,status)
    if(!service){
        throw new AppError(ERROR_MESSAGES.SERVICE_NOT_FOUND,HttpStatus.NOT_FOUND)
    }

    return ServiceMapper.toListUnlistResponseDTO(service)
}
}