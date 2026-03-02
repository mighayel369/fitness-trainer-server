import { UserResponseDTO } from "./fetch-all-users.dto";
export interface AdminUserDetailDTO extends UserResponseDTO {    
  role: string;         
  createdAt: Date;   
  gender?: string;
  age?: number;
  phone?: string;
  address?: string;
  profilePic?: string;
}


export interface UserProfileDTO extends Omit<UserResponseDTO,'status'> {
  role:string,
  gender?: string;
  age?: number;
  phone?: string;
  address?: string;
  profilePic?: string;
}