
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { LoginResponseDTO,LoginRequestDTO } from "application/dto/auth/login.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { AuthMapper } from "application/mappers/auth-mapper";
import { IJwtService } from "domain/services/i-jwt.service";
import { UserRole } from "utils/Constants";

@injectable()
export class UserLoginUseCase implements ILoginUseCase {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo,
    @inject("IPasswordHasher") private readonly _passwordHasher: IPasswordHasher,
    @inject("JwtServiceImpl") private _jwtService: IJwtService
  ) {}

  async execute(input: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = input;
    const user = await this._userRepo.findUserByEmail(email)
    console.log(user)
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.USER_BLOCKED, HttpStatus.FORBIDDEN);
    }

    const isMatch = await this._passwordHasher.compare(
      password, 
      user.password ?? ""
    );
    
    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    const tokenPayload = { 
      id: user.userId, 
      email: user.email, 
      role: UserRole.USER 
    };

    return AuthMapper.toLoginResponse(
      this._jwtService.generateAccessToken(tokenPayload),
      this._jwtService.generateRefreshToken(tokenPayload)
    );
  }
}