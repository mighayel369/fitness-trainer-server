export interface IVerificationUseCase<T>{
    handleVerification(id: string, action: string, reason?: string):Promise<T|null>
}