export interface IFindAllPendingTrainersUseCase<T>{
      findPendingTrainers(page: number,limit: number,search?: string): Promise<{ data: T[]; totalPages: number }> 
    
}