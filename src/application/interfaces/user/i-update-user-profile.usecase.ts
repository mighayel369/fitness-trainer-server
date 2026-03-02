import { UserProfileUpdateRequestDTO } from "application/dto/user/update-user-profile.dto";

export interface IUpdateUserProfileUseCase{
    execute(input:UserProfileUpdateRequestDTO):Promise<void>
}