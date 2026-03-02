import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ITrainerDashBoard } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { AppError } from "domain/errors/AppError";
import { DashboardMapper } from "application/mappers/dashboard-mapper";
@injectable()
export class TrainerDashboardUsecase implements ITrainerDashBoard {
  constructor(
    @inject("BookingRepo") private _bookingRepo: IBookingRepo,
    @inject("ITrainerRepo") private _trainerRepo: ITrainerRepo
  ) {}

  async execute(trainerId: string): Promise<TrainerDashboardResponseDTO> {
    const trainer = await this._trainerRepo.findTrainerById(trainerId);
    if (!trainer) throw new AppError("Trainer not found", 404);

    const now = new Date();
    
    const [earnings, pending, progress, performance, upcomingTotal] = await Promise.all([
      this._bookingRepo.getMonthlyEarnings(trainerId, now.getMonth(), now.getFullYear()),
      this._bookingRepo.getPendingActions(trainerId),
      this._bookingRepo.getTodayProgress(trainerId),
      this._bookingRepo.getPerformanceData(trainerId),
      this._bookingRepo.findUpcomingBookingCount(trainerId)
    ]);

    return DashboardMapper.toTrainerDashboardResponseDTO(
      earnings,
      pending,
      progress,
      performance,
      upcomingTotal,
      trainer.rating || 0
    );
  }
}