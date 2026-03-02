

export interface IFetchUserDetailsUseCase<ResDTO>{
    execute(userId:string):Promise<ResDTO>
}