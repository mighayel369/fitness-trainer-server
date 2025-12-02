export class UserEntity {
  constructor(
    public name: string,
    public email: string,
    public _id: string,
    public status: boolean,
    public role: string,
    public createdAt?: Date,
    public gender?: string,
    public age?: number,
    public googleId?: string | null,
    public phone?: string | null,    
    public address?: string | null, 
    public password?: string | null,
    public profilePic?:string | null
  ) {}
}

export type CreateParamUser = {
  name: string;
  email: string;
  password: string;
  role: string;
};