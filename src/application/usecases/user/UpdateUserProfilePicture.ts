import { IUpdateProfilePicture } from "domain/usecases/IUpdateProfilePicture";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { ICloudinaryService } from "domain/services/ICloudinaryService";

@injectable()
export class UpdateUserProfilePicture implements IUpdateProfilePicture {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo,
    @inject("ICloudinaryService") private readonly _cloudinaryService: ICloudinaryService
  ) {}

  async updateProfilePic(file:Express.Multer.File,id:string): Promise<{ success: boolean; imageUrl?: string; message: string }> {
    try {
      const user = await this._userRepo.findUserById(id)
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const imageUrl = await this._cloudinaryService.getProfilePictureUrl(file, id);

      await this._userRepo.update(id, { profilePic: imageUrl });

      return { success: true,  imageUrl,  message: "Profile photo updated successfully", };
    } catch (error) {
      console.error("Error updating profile picture:", error);
      return {
        success: false,
        message: "Failed to update profile picture. Please try again.",
      };
    }
  }
}
