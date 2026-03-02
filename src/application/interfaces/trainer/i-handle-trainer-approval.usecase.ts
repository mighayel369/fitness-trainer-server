import { TrainerApprovalRequestDTO, TrainerApprovalResponseDTO } from "application/dto/trainer/trainer-approval.dto";

export interface IHandleTrainerApproval{
    execute(input:TrainerApprovalRequestDTO):Promise<TrainerApprovalResponseDTO>
}