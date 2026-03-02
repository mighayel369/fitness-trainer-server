import { TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";

export interface ITrainerDashBoard{
    execute(trainerId:string):Promise<TrainerDashboardResponseDTO>
}