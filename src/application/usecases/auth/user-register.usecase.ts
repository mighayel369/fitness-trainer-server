import { inject, injectable } from "tsyringe";
import { randomUUID } from "crypto";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { IRegisterUseCase } from "application/interfaces/auth/i-register.usecase";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IOtpService } from "domain/services/IOtpService";
import { UserRegisterRequestDTO, RegisterResponseDTO } from "application/dto/auth/register.dto";
import { UserRole } from "utils/Constants";
import { UserEntity } from "domain/entities/UserEntity";

@injectable()
export class UserRegisterUseCase implements IRegisterUseCase<UserRegisterRequestDTO> {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo,
    @inject("IPasswordHasher") private readonly _passwordHasher: IPasswordHasher,
    @inject("IOtpService") private readonly _otpService: IOtpService 
  ) {}

  async execute(payload: UserRegisterRequestDTO): Promise<RegisterResponseDTO> {
    const userExist = await this._userRepo.findUserByEmail(payload.email);
    if (userExist) {
      throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, HttpStatus.CONFLICT);
    }

    const hashedPassword = await this._passwordHasher.hash(payload.password);

    const newUser = new UserEntity(
      payload.name,
      payload.email,
      randomUUID(),
      UserRole.USER,
      hashedPassword
    );

    const user=await this._userRepo.registerUser(newUser);
if (!user || !user.userId) {
      throw new AppError("Failed to persist user data", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
     
      const otpSent = await this._otpService.sendOtp(user.email, UserRole.USER);
      if (!otpSent) throw new Error("OTP_SERVICE_UNAVAILABLE");

      return { email: user.email };

    } catch (error) {
      await this._userRepo.removeUser(user.userId);
      throw new AppError(
        "Registration incomplete due to a service error. Please try again.", 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}