import { injectable, inject } from "tsyringe";
import { IUpdateUserProfileUseCase } from "application/interfaces/user/i-update-user-profile.usecase";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UserProfileUpdateRequestDTO } from "application/dto/user/update-user-profile.dto";
import { UserEntity } from "domain/entities/UserEntity";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo
  ) {}

  async execute(input: UserProfileUpdateRequestDTO): Promise<void> {
    const { userId, data } = input;

    const existingUser = await this._userRepo.findUserById(userId);
    if (!existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updatedEntity = new UserEntity(
      data.name || existingUser.name,
      existingUser.email, 
      userId,
      existingUser.role,
      existingUser.password,
      existingUser.status,
      existingUser.createdAt,
      data.gender ?? existingUser.gender,
      data.age ?? existingUser.age,
      existingUser.googleId,
      data.phone ?? existingUser.phone,
      data.address ?? existingUser.address,
      existingUser.profilePic
    );

    if (updatedEntity.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    await this._userRepo.updateUserData(userId, updatedEntity);
  }
}