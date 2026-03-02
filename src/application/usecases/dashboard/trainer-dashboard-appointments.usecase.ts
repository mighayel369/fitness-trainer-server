import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { ITrainerDashBoardAppointments } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";
import { TrainerDashboardAppointmentResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { DashboardMapper } from "application/mappers/dashboard-mapper";

@injectable()
export class TrainerDashboardAppointmentUsecase implements ITrainerDashBoardAppointments {
  constructor(
    @inject("BookingRepo") private _bookingRepo: IBookingRepo
  ) {}

  async execute(trainerId: string, date: Date): Promise<TrainerDashboardAppointmentResponseDTO> {
    const appointments = await this._bookingRepo.getUpcomingAppointmentsByDate(trainerId, date);

    return DashboardMapper.torainerAppointmentResponseDTO(appointments)
  }
}