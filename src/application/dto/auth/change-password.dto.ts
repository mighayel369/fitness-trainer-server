export interface ChangePasswordRequestDTO {
  oldPassword: string;
  newPassword: string;
  userId:string;
}

export interface ResetPasswordTokenBasedDTO {
  token: string;
  newPassword: string;
}