import { inject,injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IUserRepo } from "domain/repositories/IUserRepo";
@injectable()
export class getDashboardData {
  constructor(
    @inject("ITrainerRepo") private readonly trainerRepo: ITrainerRepo,
    @inject("IUserRepo") private readonly userRepo: IUserRepo
  ) {}

  async getData(): Promise<{ trainersCount: number; usersCount: number }> {
    const trainersCount = await this.trainerRepo.trainerCount("");
    const usersCount = await this.userRepo.userCount("");

    return { trainersCount, usersCount };
  }
}
