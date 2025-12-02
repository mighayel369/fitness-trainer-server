import { injectable } from "tsyringe";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import ServiceModel, { IService } from "../models/ServiceModel";
import { BaseRepository } from "./BaseRepository";
import { ServiceEntity } from "domain/entities/ServiceEntity";
import { ServiceMapper } from "../mappers/ServiceMapper";
import { Model } from "mongoose";

@injectable()
export class ServiceRepoImpl
  extends BaseRepository<IService, ServiceEntity>
  implements IServiceRepo
{
  protected model: Model<IService> = ServiceModel;
  protected toEntity = ServiceMapper.toEntity;

  async fetchServices(page: number,limit: number,search?: string): Promise<{ services: ServiceEntity[]; totalPages: number }> {
    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const totalCount = await this.model.countDocuments(filter);
    const docs = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      services: docs.map(this.toEntity),
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}
