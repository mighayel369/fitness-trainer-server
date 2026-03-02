import { inject, injectable } from "tsyringe";
import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UpdateProfilePictureRequestDTO } from "application/dto/common/update-profile-picture.dto.";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateUserProfilePicture implements IUpdateProfilePicture {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo,
    @inject("ICloudinaryService") private readonly _cloudinary: ICloudinaryService
  ) {}

  async execute(input: UpdateProfilePictureRequestDTO): Promise<string> {
    const { id, profilePic } = input;

    if (!profilePic) {
      throw new AppError(ERROR_MESSAGES.PROFILE_PICTURE_MISSING, HttpStatus.BAD_REQUEST);
    }
    const user = await this._userRepo.findUserById(id);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const imageUrl = await this._cloudinary.getProfilePictureUrl(profilePic, id);

    await this._userRepo.updateUserProfilePicture(id, imageUrl);
    
    return imageUrl;
  }
}