import { LoginResponseDTO,LoginRequestDTO } from "application/dto/auth/login.dto";

export interface ILoginUseCase {
  execute(input:LoginRequestDTO): Promise<LoginResponseDTO>;
}