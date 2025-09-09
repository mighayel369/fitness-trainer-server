import { IFindByIdUseCase } from "domain/usecases/IFindByIdUseCase";
import { UserEntity } from "domain/entities/UserEntity";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";

@injectable()
export class FindUserByIdUseCase implements IFindByIdUseCase<UserEntity> {
  constructor(
    @inject("IUserRepo") private readonly userRepo: IUserRepo
  ) {}

  async find(id: string): Promise<UserEntity | null> {
    return this.userRepo.findUserById(id);
  }
}