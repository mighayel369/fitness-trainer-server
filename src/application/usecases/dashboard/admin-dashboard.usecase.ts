import { IAdminDashboard } from "application/interfaces/dashboard/i-admin-dashboard.usecase";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { AdminDashbardResponseDTO } from "application/dto/dashboard/admin-dashboard.dto";
import { inject,injectable } from "tsyringe";
import { DashboardMapper } from "application/mappers/dashboard-mapper";
@injectable()
export class AdminDashboardUsecase implements IAdminDashboard {
    constructor(
        @inject('BookingRepo') private _bookingRepo: IBookingRepo,
        @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo
    ) {}

    async execute(): Promise<AdminDashbardResponseDTO> {

        const [analytics, totalActiveTrainers, trainerPerformance, retentionData] = await Promise.all([
            this._bookingRepo.getAdminDashboardStats(),
            this._trainerRepo.countActiveTrainers(),
            this._bookingRepo.getTrainerPerformanceAnalytics(),
            this._bookingRepo.calculateUserRetention()
        ]);


        return DashboardMapper.toAdminDashboardResponseDTO(
            analytics,
            totalActiveTrainers,
            trainerPerformance,
            retentionData
        );
    }
}