import { CreateServiceRequestDTO } from "application/dto/services/create.service.dto";

export interface ICreateServiceUseCase{
    execute(input:CreateServiceRequestDTO):Promise<void>
}