export class TrainerEntity {
  constructor(
    public name: string,
    public email: string,
    public _id: string,
    public status: boolean,
    public verified: "pending" | "accepted" | "rejected",
    public role: string,
    public gender: string,
    public experience: string,
    public specialization: string[],
    public certificate: string | null,
    public createdAt: Date,
    public bio?:string|null,
    public googleId?: string | null,
    public password?: string | null,
    public phone?: string | null,
    public address?: string | null,
    public rating?: number,
    public languages?: string[], 
    public pricing?: number,
    public rejectReason?: string | null,
    public timeSlot?: { startTime: string; endTime: string }[] | null,
    public profilePic?:string | null
  ) {}
}


export type CreateParamTrainer = {
  name: string;
  email: string;
  password: string;
  role: string;
  experience: string;
  specialization: string[];
  gender: string;
  certificate?:string;
  languages?: string[];
  verified?:string;
};
