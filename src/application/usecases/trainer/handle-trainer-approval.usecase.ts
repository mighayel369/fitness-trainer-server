import { injectable, inject } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IOtpService } from "domain/services/IOtpService";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerApprovalRequestDTO, TrainerApprovalResponseDTO } from "application/dto/trainer/trainer-approval.dto";
import { IHandleTrainerApproval } from "application/interfaces/trainer/i-handle-trainer-approval.usecase";
import { APPROVAL_MESSAGES } from "utils/Constants";
import { TrainerMapper } from "application/mappers/trainer-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class HandleTrainerApproval implements IHandleTrainerApproval {
  constructor(
    @inject("ITrainerRepo") private readonly _repo: ITrainerRepo,
    @inject("IOtpService") private readonly _mail: IOtpService
  ) {}

  async execute(data: TrainerApprovalRequestDTO): Promise<TrainerApprovalResponseDTO> {
    const { trainerId, action, reason } = data;
    const verificationStatus = action === "accept" ? "accepted" : "rejected";

    const trainer = await this._repo.updateVerificationStatus(trainerId, verificationStatus, reason);
    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const emailBody = action === "accept" 
      ? APPROVAL_MESSAGES.SUCCESS_BODY(trainer.name)
      : APPROVAL_MESSAGES.REJECT_BODY(trainer.name, reason || "Documentation mismatch");

    const emailType = action === "accept" ? "success" : "error";
    
    await this._mail.sendEmail(trainer.email, emailBody, emailType);

    return TrainerMapper.toTrainerApprovalResponseDTO(trainer);
  }
}