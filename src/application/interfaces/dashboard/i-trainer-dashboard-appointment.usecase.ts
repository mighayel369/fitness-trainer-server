import { TrainerDashboardAppointmentResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";

export interface ITrainerDashBoardAppointments{
    execute(trainerId:string,date:Date):Promise<TrainerDashboardAppointmentResponseDTO>
}