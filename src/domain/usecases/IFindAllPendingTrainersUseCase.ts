export interface IFindAllPendingTrainersUseCase<T>{
    findPendingTrainers():Promise<T[]|null>
}