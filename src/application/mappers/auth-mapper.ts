import { LoginResponseDTO } from "application/dto/auth/login.dto";
import { UserEntity } from "domain/entities/UserEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { ClientSessionDTO, TrainerSessionDTO } from "application/dto/auth/verify-session.dto";
import { UserRole } from "utils/Constants";
export class AuthMapper {
  static toLoginResponse(accessToken: string, refreshToken: string): LoginResponseDTO {
    console.log(accessToken,refreshToken)
    return {
      accessToken,
      refreshToken
    };
  }
static toVerifySessionResponseDTO(entity: UserEntity): ClientSessionDTO  {
    return {
      name:entity.name,
      profilePic:entity.profilePic || '',
      status:entity.status!,
      role:UserRole.USER
    }
  }
 static toVerifyTrainerSessionResponseDTO(entity: TrainerEntity): TrainerSessionDTO  {
    return {
      name:entity.name,
      profilePic:entity.profilePic || '',
      status:entity.status!,
      role:UserRole.TRAINER,
      verified:entity.verified
    }
  }
}