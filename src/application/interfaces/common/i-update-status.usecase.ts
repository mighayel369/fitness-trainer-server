import { UpdateStatusRequestDTO,UpdateStatusResponseDTO } from "application/dto/common/update-status.dto";

export interface IUpdateStatus{
    execute(input:UpdateStatusRequestDTO):Promise<UpdateStatusResponseDTO>
}