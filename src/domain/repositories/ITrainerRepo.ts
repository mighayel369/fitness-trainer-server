
import { TrainerEntity, TrainerFilter } from "domain/entities/TrainerEntity";

export interface ITrainerRepo {
  RegisterTrainer(payload: TrainerEntity): Promise<TrainerEntity|null>; 
  findTrainerById(id: string): Promise<TrainerEntity | null>;
  updateTrainer(id: string, payload: TrainerEntity): Promise<void>;
  updateVerificationStatus(id: string, status: "accepted" | "rejected", reason?: string): Promise<TrainerEntity | null>;
  deleteTrainer(id: string): Promise<boolean>;
  findTrainerByEmail(email: string): Promise<TrainerEntity | null>;
  findAccepted(page: number, limit: number, filter: TrainerFilter): Promise<{ data: TrainerEntity[]; totalCount: number }>;
  findPending(page: number, limit: number, filter: TrainerFilter): Promise<{ data: TrainerEntity[]; totalCount: number }>;
  updateTrainerStatus(id: string, status: boolean): Promise<void>;
  countActiveTrainers(): Promise<number>;
  updateTrainerProfilePicture(userId:string,profilePic:string):Promise<TrainerEntity|null>
}