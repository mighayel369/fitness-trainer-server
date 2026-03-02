import { PaginationInputDTO,PaginationOutputDTO } from "../common/PaginationDto";
export interface FetchAllUsersRequestDTO extends PaginationInputDTO{}

export interface UserResponseDTO {
  userId: string;
  name: string;
  email:string;
  status: boolean;
}


export type FetchAllUsersResponseDTO = PaginationOutputDTO<UserResponseDTO>;