import { UserEntity } from "domain/entities/UserEntity";
import { UserResponseDTO } from "application/dto/user/fetch-all-users.dto";
import { UserProfileDTO, AdminUserDetailDTO } from "application/dto/user/user-details.dto";
import { USER_STATUS_MESSAGES } from "utils/Constants";
import { UpdateStatusResponseDTO } from "application/dto/common/update-status.dto";
export class UserMapper {
  static toUserResponseDTO(entity: UserEntity): UserResponseDTO {
    return {
      userId: entity.userId,
      name: entity.name,
      email: entity.email,
      status: entity.status ?? true,
    };
  }

  static toAdminDetailDTO(user: UserEntity): AdminUserDetailDTO {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      status: user.status ?? true,
      role: user.role,
      createdAt: user.createdAt || new Date(),
      gender: user.gender,
      age: user.age,
      phone: user.phone ?? "",
      address: user.address ?? "",
      profilePic: user.profilePic ?? "",
    };
  }

  static toUserProfileDTO(user: UserEntity): UserProfileDTO {
    return {
      userId: user.userId, 
      name: user.name,
      email: user.email,
      gender: user.gender,
      age: user.age,
      role:user.role,
      phone: user.phone ?? "",
      address: user.address ?? "",
      profilePic: user.profilePic ?? "",
    };
  }
  static toUpdateStatusResponseDTO(isActive: boolean): UpdateStatusResponseDTO {
      return {
          success: true,
          message: isActive ? USER_STATUS_MESSAGES.UNBLOCK_SUCCESS : USER_STATUS_MESSAGES.BLOCK_SUCCESS,
          newStatus: isActive
      };
  }
}