import { RegisterResponseDTO } from "application/dto/auth/register.dto";

export interface IRegisterUseCase<T> {
  execute(payload: T, file?: Express.Multer.File): Promise<RegisterResponseDTO>;
}