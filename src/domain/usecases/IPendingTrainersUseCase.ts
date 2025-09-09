export interface IPendingTrainersUseCase<T>{
    findPendingTrainerDetails(id:string):Promise<T|null>
}