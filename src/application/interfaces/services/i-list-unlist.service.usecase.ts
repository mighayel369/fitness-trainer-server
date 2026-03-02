import { ListUnlistRequestDTO,ListUnlistResponseDTO } from "application/dto/services/list-unlist.service.dto"
export interface IListUnlistServiceUseCase{
    execute(input:ListUnlistRequestDTO):Promise<ListUnlistResponseDTO>
}