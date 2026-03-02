import { AdminDashbardResponseDTO } from "application/dto/dashboard/admin-dashboard.dto";

export interface IAdminDashboard{
    execute():Promise<AdminDashbardResponseDTO>
}