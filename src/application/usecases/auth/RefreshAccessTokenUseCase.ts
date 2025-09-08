import { JwtService } from "infrastructure/services/JwtService";
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from "core/ErrorMessage";
import { IRefreshAccessTokenUseCase } from "domain/usecases/IRefreshAccessTokenUseCase";
@injectable()
export class RefreshAccessTokenUseCase implements IRefreshAccessTokenUseCase{
  async execute(refreshToken: string) {
    try {
      const decoded: any = JwtService.verifyRefreshToken(refreshToken);
      const newAccessToken = JwtService.generateAccessToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });
      console.log('new accesstoek',newAccessToken)
      return { success: true, accessToken: newAccessToken };
    } catch {
      return { success: false, message: ERROR_MESSAGES.REFRESH_TOKEN_INVALID };
    }
  }
}
