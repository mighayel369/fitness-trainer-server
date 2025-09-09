import { UserEntity } from "domain/entities/UserEntity";
import { IFindAllUseCase, IPaginatedResult } from "domain/usecases/IFindAllUseCase";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";

@injectable()
export class FindAllUsersUseCase implements IFindAllUseCase<UserEntity> {
  constructor(
    @inject("IUserRepo") private readonly userRepo: IUserRepo
  ) {}

  async findAll(page=1, search=''): Promise<IPaginatedResult<UserEntity>> {
    const users = await this.userRepo.findAllUsers(page, search);
    const count = await this.userRepo.userCount(search);
    const totalPages = Math.max(1, Math.ceil(count / 5));

    return { data: users, totalPages };
  }
}
