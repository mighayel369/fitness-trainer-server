import { IFetchAllUsersUseCase } from "application/interfaces/user/i-fetch-all-users.usecase";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { FetchAllUsersRequestDTO, FetchAllUsersResponseDTO } from "application/dto/user/fetch-all-users.dto";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { UserMapper } from "application/mappers/user-mapper";
@injectable()
export class FetchAllUsersUseCase implements  IFetchAllUsersUseCase {
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo
  ) {}
async execute(input: FetchAllUsersRequestDTO): Promise<FetchAllUsersResponseDTO> {
  let {limit,currentPage,searchQuery,filter}=input
      if (currentPage <= 0 || limit <= 0) {
        throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
      }

      const { data, totalCount } = await this._userRepo.findAllUsers(
      currentPage,
      limit,
      searchQuery || "",
      filter || {}
    );

    return {
      data:data.map(d=>UserMapper.toUserResponseDTO(d)),
      total:totalCount
    }
}
}

