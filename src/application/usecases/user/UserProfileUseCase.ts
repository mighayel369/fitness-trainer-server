import { inject, injectable } from "tsyringe";
import { IUpdatableProfile } from "domain/usecases/IUpdatableProfileUseCase";
import { UserEntity } from "domain/entities/UserEntity";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { ERROR_MESSAGES } from "core/ErrorMessage";
@injectable()
export class UserProfileUseCase implements IUpdatableProfile<UserEntity> {
  constructor(  @inject("IUserRepo") private readonly _userRepo: IUserRepo) {}

  async updateData(id: string, data: Partial<UserEntity>) {
    const updated = await this._userRepo.updateUserData(id, data);
    if (!updated) {
      return { success: false, message: ERROR_MESSAGES.USER_NOT_FOUND };
    }
    return { success: true, data: updated };
  }
}
