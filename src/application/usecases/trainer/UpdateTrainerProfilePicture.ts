import { IUpdateProfilePicture } from "domain/usecases/IUpdateProfilePicture";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ICloudinaryService } from "domain/services/ICloudinaryService";

@injectable()
export class UpdateTrainerProfilePicture implements IUpdateProfilePicture {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
    @inject("ICloudinaryService") private readonly _cloudinaryService: ICloudinaryService
  ) {}

  async updateProfilePic(file:Express.Multer.File,id:string): Promise<{ success: boolean; imageUrl?: string; message: string }> {
    try {
      const trainer = await this._trainerRepo.findTrainerById(id);
      if (!trainer) {
        return { success: false, message: "Trainer not found" };
      }

      const imageUrl = await this._cloudinaryService.getProfilePictureUrl(file, id);

      await this._trainerRepo.findTrainerByIdAndUpdate(id, { profilePic: imageUrl });

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
