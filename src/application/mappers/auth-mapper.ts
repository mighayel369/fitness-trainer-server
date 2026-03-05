import { LoginResponseDTO } from "application/dto/auth/login.dto";
import { VerifySessionResponseDTO } from "application/dto/auth/verify-session.dto";
import { UserEntity } from "domain/entities/UserEntity";


export class AuthMapper {
  static toLoginResponse(accessToken: string, refreshToken: string): LoginResponseDTO {
    console.log(accessToken,refreshToken)
    return {
      accessToken,
      refreshToken
    };
  }
  static toVerifySessionResponseDTO(entity:UserEntity):VerifySessionResponseDTO{
    return {
      name:entity.name,
      role:entity.role,
      profilePic:entity.profilePic ?? ''
    }
  }
}