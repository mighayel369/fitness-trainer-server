import { AdminEntity } from "domain/entities/AdminEntity";

export interface IAdminRepo {
    findAdminByEmail(email: string): Promise<AdminEntity | null>;
}