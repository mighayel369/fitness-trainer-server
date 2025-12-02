import { CreateParamUser, UserEntity } from "domain/entities/UserEntity";

export interface IUserRepo {
    createUser(payload: CreateParamUser): Promise<UserEntity | null>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    updateVerification(email: string): Promise<boolean>;
    findUserById(id: string): Promise<UserEntity | null>;
     findMany(filter?: object,page?: number,limit?: number): Promise<{ data: UserEntity[]; totalCount: number }>;
    userCount(search: string): Promise<number>;
    updateUserStatus(id: string, status: boolean): Promise<void>;
    updateUserData(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
    update(id:string,data:Partial<UserEntity>):Promise<UserEntity|null>
}


