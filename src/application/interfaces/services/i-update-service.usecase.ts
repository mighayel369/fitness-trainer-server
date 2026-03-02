import { UpdateServiceRequestDTO } from "application/dto/services/update.service.dto"

export interface IUpdateServiceUseCase{
    execute(input:UpdateServiceRequestDTO):Promise<void>
}