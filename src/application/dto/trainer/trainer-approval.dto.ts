
export interface TrainerApprovalRequestDTO {
    trainerId: string;
    action: "accept" | "decline";
    reason?: string;
}

export interface TrainerApprovalResponseDTO {
    success:boolean;
    message: string;
    updatedStatus: "accepted" | "rejected";
    trainerName: string;
}