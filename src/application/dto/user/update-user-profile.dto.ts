
export interface UpdateUserProfileDTO {
  name: string;
  phone: string;
  address: string;
  gender?: string;
  age?: number;
}

export interface UserProfileUpdateRequestDTO{
    userId: string;
    data:UpdateUserProfileDTO
}