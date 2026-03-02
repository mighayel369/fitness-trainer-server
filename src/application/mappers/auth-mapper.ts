import { LoginResponseDTO } from "application/dto/auth/login.dto";

export class AuthMapper {
  static toLoginResponse(accessToken: string, refreshToken: string): LoginResponseDTO {
    console.log(accessToken,refreshToken)
    return {
      accessToken,
      refreshToken
    };
  }
}