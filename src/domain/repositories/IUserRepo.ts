import { CreateParamUser, UserEntity } from "domain/entities/UserEntity";

export interface IUserRepo {
    createUser(payload: CreateParamUser): Promise<UserEntity | null>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    updateVerification(email: string): Promise<boolean>;
    findUserById(id: string): Promise<UserEntity | null>;
    findAllUsers(page: number, search: string): Promise<UserEntity[]>;
    userCount(search: string): Promise<number>;
    updateUserStatus(id: string, status: boolean): Promise<void>;
    updateUserData(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
}


