import { inject, injectable } from "tsyringe";
import { IAdminRepo } from "domain/repositories/IAdminRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { IJwtService } from "domain/services/i-jwt.service";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { LoginResponseDTO, LoginRequestDTO } from "application/dto/auth/login.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { AuthMapper } from "application/mappers/auth-mapper";
import { UserRole } from "utils/Constants";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class AdminLoginUsecase implements ILoginUseCase {
  constructor(
    @inject("IAdminRepo") private _AdminRepo: IAdminRepo,
    @inject("IPasswordHasher") private _passwordHasher: IPasswordHasher,
    @inject("JwtServiceImpl") private _jwtService: IJwtService 
  ) {}

  async execute(input: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = input;

    const admin = await this._AdminRepo.findAdminByEmail(email);

    if (!admin || !admin.canAuthenticate()) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    const isMatch = await this._passwordHasher.compare(password, admin.password!);

    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    const payload = {
      id: admin._id!,
      email: admin.email,
      role: UserRole.ADMIN,
    };

    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);
    console.log(refreshToken)
    return AuthMapper.toLoginResponse(accessToken, refreshToken);
  }
}