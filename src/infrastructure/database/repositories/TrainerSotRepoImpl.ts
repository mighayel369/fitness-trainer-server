import { injectable } from "tsyringe";
import { TrainerSlotMapper } from "../mappers/TrainerSlotMapper";
import { ITrainerSlotRepo } from "domain/repositories/ITrainerSlotRepo";
import { BaseRepository } from "./BaseRepository";
import { TrainerSlotEntity } from "domain/entities/TrainerSlotEntity";
import { TrainerSlot,ITrainerSlot } from "../models/TrainerSlotModel";
import { Model } from "mongoose";

@injectable()
export class TrainerSlotRepoImpl extends BaseRepository<ITrainerSlot, TrainerSlotEntity> implements ITrainerSlotRepo {
  protected model: Model<ITrainerSlot> = TrainerSlot; 
  protected toEntity = TrainerSlotMapper.toEntity;

  async find(trainerId: string, startDate?: string, endDate?: string): Promise<TrainerSlotEntity[] | null> {
    const query: any = { trainerId };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    }

    const docs = await this.model.find(query).lean();

    if (!docs || docs.length === 0) return null;

    return docs.map((doc) => this.toEntity(doc));
  }
}

