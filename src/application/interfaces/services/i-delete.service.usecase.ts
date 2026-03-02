export interface IDeleteServiceUseCase{
    execute(serviceId:string):Promise<void>
}