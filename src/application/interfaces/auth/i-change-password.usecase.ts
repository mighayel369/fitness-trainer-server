
export interface IChangePasswordUseCase<requestDTO>{
    execute(input:requestDTO):Promise<void>
}

