
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { IJwtService } from "domain/services/i-jwt.service";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { LoginResponseDTO,LoginRequestDTO } from "application/dto/auth/login.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AuthMapper } from "application/mappers/auth-mapper";
import { UserRole } from "utils/Constants";
@injectable()
export class TrainerLoginUseCase implements ILoginUseCase {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
    @inject("IPasswordHasher") private readonly _passwordHasher: IPasswordHasher,
    @inject("JwtServiceImpl") private _jwtService: IJwtService
  ) {}

  async execute(input: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = input;
console.log(input)
    const trainer = await this._trainerRepo.findTrainerByEmail(email);

    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!trainer.password) {
    throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    if (trainer.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.TRAINER_BLOCKED, HttpStatus.FORBIDDEN);
    }



    const isMatch = await this._passwordHasher.compare(password, trainer.password);
    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    const payload = { id: trainer.trainerId!, email: trainer.email, role: UserRole.TRAINER };
    

    return AuthMapper.toLoginResponse(this._jwtService.generateAccessToken(payload),
     this._jwtService.generateRefreshToken(payload));
  }
}