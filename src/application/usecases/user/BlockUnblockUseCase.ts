import { IBlockUnblockUseCase } from "domain/usecases/IBlockUnblockUseCase";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import logger from "core/logger";

@injectable()
export class BlockUnblockUserCase implements  IBlockUnblockUseCase{
  constructor(
    @inject("IUserRepo") private readonly _userRepo: IUserRepo
  ) {}

  async  updateStatus(id: string, status: boolean): Promise<void> {
    logger.info(`User ${id} status updated to ${status}`);
    await this._userRepo.updateUserStatus(id, status);
  }

}
