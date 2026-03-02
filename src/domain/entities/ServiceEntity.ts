export class ServiceEntity {
  constructor(
    public serviceId:string,
    public name: string,
    public description:string,
    public duration: number,
    public servicePic: string,  
    public status?:boolean,
    public createdAt?: Date
  ) {}
}


