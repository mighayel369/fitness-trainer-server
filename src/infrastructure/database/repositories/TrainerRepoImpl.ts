

import { injectable } from "tsyringe";
import TrainerModel,{ITrainer} from "../models/TrainerModel";
import { BaseRepository } from "./BaseRepository";
import { TrainerEntity, TrainerFilter } from "domain/entities/TrainerEntity";
import { TrainerMapper } from "../mappers/TrainerMapper";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { STATUS } from "utils/Constants";
@injectable()
export class TrainerRepoImpl extends BaseRepository<ITrainer, TrainerEntity> implements ITrainerRepo{
  protected model = TrainerModel;
  protected toEntity = TrainerMapper.toEntity;

async RegisterTrainer(payload: TrainerEntity): Promise<TrainerEntity | null> {
  const doc = await this.model.create({ ...payload });
  return doc ? this.toEntity(doc) : null;
}
async updateTrainerStatus(id: string, newStatus: boolean): Promise<void> {
  await this.model.findOneAndUpdate(
    {trainerId:id}, 
    { $set: { status: newStatus } }
  );
}

async findTrainerById(id: string): Promise<TrainerEntity | null> {
  const pipeline = [
    { 
      $match: { 
        trainerId: id, 
        role: "trainer" 
      } 
    },
    {
      $lookup: {
        from: "services",  
        localField: "services", 
        foreignField: "serviceId", 
        as: "populatedServices"    
      }
    },
    {
      $addFields: {
        services: "$populatedServices"
      }
    },

    {
      $project: {
        populatedServices: 0
      }
    }
  ];
  const result = await this.model.aggregate(pipeline);

  if (!result || result.length === 0) {
    return null;
  }
  return this.toEntity(result[0]);
}

 async findTrainerByEmail(email: string): Promise<TrainerEntity | null> {
  console.log('repoimpl')
    return this.aggregateOne(
      {email},
    {
      from: "services",
      localField: "services",
      foreignField: "serviceId",
      as: "populatedServices"
    }
    ) 
  }
  
async updateTrainer(id: string, payload: TrainerEntity): Promise<void> {
  const persistenceData = {
    ...payload,
    services: payload.services.map(s => s.serviceId) 
  };

   await this.model.findOneAndUpdate(
    { trainerId: id },
    { $set: persistenceData }, 
    { new: true }
  );
}


async updateVerificationStatus(id: string, status: "accepted" | "rejected", reason?: string): Promise<TrainerEntity | null> {
  await this.model.findOneAndUpdate(
    { trainerId: id },
    {
      verified: status,
      rejectReason: status === "rejected" ? reason : undefined
    }
  );

  return this.aggregateOne(
    { trainerId: id },
    {
      from: "services",
      localField: "services",
      foreignField: "serviceId",
      as: "populatedServices"
    }
  );
}

  async deleteTrainer(id: string) {
      return this.delete(id);
  }

async findAccepted(
  page: number, 
  limit: number, 
  filter: TrainerFilter
): Promise<{ data: TrainerEntity[]; totalCount: number }> {
  
  const skip = (page - 1) * limit;
  const matchQuery: any = { role: "trainer", verified: "accepted" };

  if (filter.searchQuery) {
    matchQuery.name = { $regex: filter.searchQuery, $options: "i" };
  }
  
  if (filter.gender) {
    matchQuery.gender = filter.gender;
  }
  if (filter.serviceId) {
    matchQuery.services = filter.serviceId; 
  }

  const sortMap = {
    rating: { rating: -1 },
    exp: { experience: -1 },
    latest: { createdAt: -1 }
  } as const;

  const sortOrder = sortMap[filter.sort ?? "latest"] || { createdAt: -1 };

  const pipeline = [
    { $match: matchQuery },
    { $sort: sortOrder },
    {
      $facet: {
        totalCount: [{ $count: "total" }],
        docs: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "services",
              localField: "services",
              foreignField: "serviceId",
              as: "populatedServices"
            }
          },
          {
            $addFields: {
              services: "$populatedServices"
            }
          },
          { $project: { populatedServices: 0 } }
        ]
      }
    }
  ];

  const result = await this.model.aggregate(pipeline);
  let totalRowCount=result[0].totalCount[0]?.total || 0
  return {
    data: result[0].docs.map((doc: any) => this.toEntity(doc)),
    totalCount: Math.ceil(totalRowCount/limit)
  };
}


async findPending(
  page: number,
  limit: number,
  filter: TrainerFilter
): Promise<{ data: TrainerEntity[]; totalCount: number }> {
  
  const skip = (page - 1) * limit;
  const matchQuery: any = { role: "trainer", verified: "pending" };

  if (filter.searchQuery) {
    matchQuery.name = { $regex: filter.searchQuery, $options: "i" };
  }

  const pipeline = [
    { $match: matchQuery },
    { $sort: { createdAt: -1 } as const },
    {
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        docs: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "services",        
              localField: "services", 
              foreignField: "serviceId", 
              as: "servicesData"         
            }
          },
          {
            $addFields: {
              services: "$servicesData"
            }
          },
          { $project: { servicesData: 0 } }
        ]
      }
    }
  ];

  const result = await this.model.aggregate(pipeline);

  const totalRowCount = result[0].totalCount[0]?.totalCount || 0;
  

  return { 
    data: result[0].docs.map((doc: any) =>this.toEntity(doc)), 
    totalCount:Math.ceil(totalRowCount/limit)
  };
}


async countActiveTrainers():Promise<number>{
  let res=await this.model.find({status:true,verified:STATUS.ACCEPT}).countDocuments()
  return res
}

async updateTrainerProfilePicture(trainerId: string, profilePic: string): Promise<TrainerEntity|null> {
  let doc=await this.model.findOneAndUpdate({trainerId},{profilePic})
  return doc?this.toEntity(doc):null
}
}
