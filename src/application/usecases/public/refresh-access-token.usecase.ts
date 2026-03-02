import { inject, injectable } from "tsyringe";
import { IRefreshAccessTokenUseCase } from "../../interfaces/public/i-refresh-access-token.usecase";
import { RefreshTokenResponseDTO } from "../../dto/public/refresh-token.response.dto";
import { IJwtService } from "domain/services/i-jwt.service";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class RefreshAccessTokenUseCase implements IRefreshAccessTokenUseCase {
  constructor(
       @inject("JwtServiceImpl") private _jwtService: IJwtService 
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponseDTO> {
      const decoded = this._jwtService.verifyRefreshToken(refreshToken);

      const newAccessToken = this._jwtService.generateAccessToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });

      if(!newAccessToken){
        throw new AppError(ERROR_MESSAGES.ACCESS_TOKEN_GENERATING_FAILURE,HttpStatus.BAD_REQUEST)
      }

      return {
        accessToken:newAccessToken
      }
  }
}