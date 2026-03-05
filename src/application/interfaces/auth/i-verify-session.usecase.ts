import { VerifySessionResponseDTO } from "application/dto/auth/verify-session.dto";


export interface IVerifySession{
    execute(userId:string):Promise<VerifySessionResponseDTO>
}