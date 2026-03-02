import { FetchAllUsersRequestDTO,FetchAllUsersResponseDTO } from "application/dto/user/fetch-all-users.dto";

export interface IFetchAllUsersUseCase{
    execute(input:FetchAllUsersRequestDTO):Promise<FetchAllUsersResponseDTO>
}