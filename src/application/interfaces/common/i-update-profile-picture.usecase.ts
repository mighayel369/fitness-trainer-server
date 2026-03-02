import { UpdateProfilePictureRequestDTO } from "application/dto/common/update-profile-picture.dto.";


export interface IUpdateProfilePicture{
    execute(input:UpdateProfilePictureRequestDTO):Promise<string>
}