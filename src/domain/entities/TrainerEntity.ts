import { ServiceEntity } from "./ServiceEntity";
import { Status } from "utils/Constants";
export class TrainerEntity {
  constructor(
    public trainerId: string,
    public name: string,
    public email: string,
    public role: string,
    public verified: Status.PENDING | Status.ACCEPT | Status.REJECT,
    public pricePerSession: number,
    public password: string | null,
    public languages: string[] = [],
    public experience: number,
    public services: ServiceEntity[] = [],
    public certificate: string | null,
    public gender: string,
    public rating: number = 0,
    public status?: boolean,
    public createdAt?: Date,
    public bio?: string | null,
    public phone?: string | null,
    public address?: string | null,
    public rejectReason?: string | null,
    public profilePic?: string | null
  ) {}

  public isBlocked(): boolean {
    return !this.status;
  }

}




export interface TrainerFilter {
  searchQuery?: string;
  gender?: "male" | "female" | "other";
  serviceId?: string;
  sort?: "rating" | "exp" | "latest";
}
