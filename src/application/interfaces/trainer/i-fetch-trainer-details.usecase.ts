
export interface IFetchTrainerDetails<responseDTO>{
    execute(trainerId:string):Promise<responseDTO>
}