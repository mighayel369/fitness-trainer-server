export class AdminEntity {
  constructor(
    public name: string,
    public email: string,
    public _id?: string,
    public password?: string,
    public createdAt?: Date
  ) {}
  public canAuthenticate(): boolean {
    return !!(this._id && this.password);
  }
}

export type CreateParamAdmin = {
  name: string;
  email: string;
  password: string;
};
