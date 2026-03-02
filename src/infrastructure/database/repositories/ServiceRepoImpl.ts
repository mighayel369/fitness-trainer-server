
import { injectable } from "tsyringe";
import { Model, Types } from "mongoose";
import { IServiceRepo } from "domain/repositories/IServiceRepo";
import ServiceModel, { IService } from "../models/ServiceModel";
import { BaseRepository } from "./BaseRepository";
import { ServiceEntity } from "domain/entities/ServiceEntity";
import { ServiceMapper } from "../mappers/ServiceMapper";


@injectable()
export class ServiceRepoImpl
  extends BaseRepository<IService, ServiceEntity>
  implements IServiceRepo
{
  protected model: Model<IService> = ServiceModel;
  protected toEntity = ServiceMapper.toEntity;

  async createService(payload:  ServiceEntity): Promise<void> {
    const doc = await this.model.create(payload);
  }

  async findAllServices(
    page: number,
    limit: number,
    search = "",
    filters: Record<string, any> = {}
  ): Promise<{ data: ServiceEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const regex = new RegExp(search, "i");

    const matchQuery = {
      ...filters,
      isDeleted: false,
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
      ],
    };

    const results = await this.model.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const items: IService[] = results[0]?.data || [];
    const total = results[0]?.totalCount[0]?.count || 0;

    return {
      data: items.map((doc) => this.toEntity(doc)),
      totalCount: Math.ceil(total/limit) ||1
    };
  }
  async findServiceById(id: string): Promise<ServiceEntity | null> {
    const doc = await this.model.findOne({serviceId:id});
    return doc ? this.toEntity(doc) : null;
  }

async updateService(
  data: Partial<ServiceEntity>
): Promise<ServiceEntity | null> {
  const {serviceId}=data
  const doc = await this.model.findOneAndUpdate(
    { serviceId}, 
    { $set: data },
    { new: true, runValidators: true }
  );
  
  return doc ? this.toEntity(doc) : null;
}

async deleteService(id: string): Promise<ServiceEntity> {
  const result = await this.model.findOneAndUpdate(
    { serviceId: id },
    { $set: { isDeleted: true, status: false, deletedAt: new Date() } }
  );
  return this.toEntity(result)
}
async updateServiceStatus(serviceId: string, status:boolean): Promise<ServiceEntity | null> {
  const doc = await this.model.findOneAndUpdate(
    { serviceId }, 
    { $set:{status} },
    { new: true}
  );
  return doc ? this.toEntity(doc) : null;
}

async findPublicServices(): Promise<ServiceEntity[]> {
  const docs = await this.model.find({ status: true, isDeleted: false });
  return docs.map(doc => this.toEntity(doc));
}

}