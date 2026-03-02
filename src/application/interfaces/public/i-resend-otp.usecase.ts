import { ResendOtpRequestDTO } from "application/dto/public/resend-otp.dto";

export interface IReSendOtpUseCase {
  execute(input: ResendOtpRequestDTO): Promise<void>;
}