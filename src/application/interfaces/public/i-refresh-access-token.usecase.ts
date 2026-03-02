import { RefreshTokenResponseDTO } from "../../dto/public/refresh-token.response.dto";

export interface IRefreshAccessTokenUseCase {
  execute(refreshToken: string): Promise<RefreshTokenResponseDTO>;
}