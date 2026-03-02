import { UserEntity} from "domain/entities/UserEntity";



export interface IUserRepo {
    registerUser(payload: UserEntity): Promise<UserEntity|null>;
  findAllUsers(
    page: number,
    limit: number,
    search: string,
    filters: Record<string, any>
  ): Promise<{ data: UserEntity[]; totalCount: number }>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    findUserById(id: string): Promise<UserEntity | null>;
    updateUserStatus(id: string, status: boolean): Promise<void>;
    updateUserData(id: string, data: UserEntity): Promise<void>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
    updateResetToken(id: string, token: string | undefined, expires: number | undefined): Promise<void>;
    removeUser(id: string): Promise<boolean>;
    countUsers():Promise<number>
    getUserGrowthData(): Promise<{date: string,count: number}[]>;
    findByResetToken(token:string):Promise<UserEntity|null>
    updateUserProfilePicture(userId:string,profilePic:string):Promise<void>
}


