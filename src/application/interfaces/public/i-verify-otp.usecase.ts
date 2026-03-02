import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";


export interface IVerifyAccountUseCase {
  execute(data: VerifyAccountRequestDTO): Promise<boolean>;
}