export class ServiceEntity {
  constructor(
    public _id:string,
    public name: string,
    public description:string,
    public status:boolean,
    public createdAt?: Date
  ) {}
}

export type CreateParamService = {
  name: string;
  description:string;
};
