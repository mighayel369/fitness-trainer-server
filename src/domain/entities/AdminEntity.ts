export class AdminEntity {
  constructor(
    public name: string,
    public email: string,
    public _id?: string,
    public password?: string,
    public createdAt?: Date
  ) {}
}

export type CreateParamAdmin = {
  name: string;
  email: string;
  password: string;
};
