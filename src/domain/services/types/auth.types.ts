import { UserRole } from "utils/Constants";

export interface IJwtPayload {
  id: string;
  email: string;
  role: UserRole;
}