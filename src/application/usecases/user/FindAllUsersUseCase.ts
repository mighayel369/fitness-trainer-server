import { UserEntity } from "domain/entities/UserEntity";
import { IFindAllUseCase } from "domain/usecases/IFindAllUseCase";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";

@injectable()
export class FindAllUsersUseCase implements IFindAllUseCase<UserEntity> {
  constructor(
    @inject("IUserRepo") private readonly userRepo: IUserRepo
  ) {}

  async findAll(page: number,limit: number,search?: string): Promise<{ data: UserEntity[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter = search ? { name: { $regex: search, $options: "i" },role:'user' } : {role:'user'};
    const { data, totalCount } = await this.userRepo.findMany(filter, limit, skip);

    const totalPages = Math.ceil(totalCount / limit);
    return { data: data, totalPages };
  }
}
