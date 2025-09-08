import { CreateParamTrainer, TrainerEntity } from "domain/entities/TrainerEntity";

export interface ITrainerRepo {
    createTrainer(payload: CreateParamTrainer): Promise<TrainerEntity | null>;
    findTrainerById(id: string): Promise<TrainerEntity | null>;
    findTrainerByEmail(email: string): Promise<TrainerEntity | null>;
    findPendingTrainers(): Promise<TrainerEntity[]>;
    findAllTrainers(page: number, search: string): Promise<TrainerEntity[]>;
    trainerCount(search: string): Promise<number>;
    findPendingTrainerDetails(id: string): Promise<TrainerEntity | null>;
    updateVerification(id: string,action:string, reason?:string): Promise<TrainerEntity | null>;
    deleteTrainer(id: string): Promise<TrainerEntity | null>;
    findTrainerByIdAndUpdate(id:string,payload:any):Promise<TrainerEntity | null>;
}
