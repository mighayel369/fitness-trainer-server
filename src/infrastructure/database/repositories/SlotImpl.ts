import { injectable } from "tsyringe";
import { SlotMapper } from "../mappers/SlotMapper";
import { ISlotRepo } from "domain/repositories/ISlotRepo";
import { BaseRepository } from "./BaseRepository";
import { SlotEntity } from "domain/entities/SlotEntity";
import { SlotModel,ISlot } from "../models/SlotModel";
import { Model,Types } from "mongoose";

@injectable()
export class SlotRepoImpl extends BaseRepository<ISlot, SlotEntity> implements ISlotRepo {
  protected model: Model<ISlot> = SlotModel;
  protected toEntity = SlotMapper.toEntity;

  async getTrainerSlot(trainerId: string): Promise<SlotEntity | null> {
    return this.findOne({ trainerId });
  }
async createTrainerSlot(trainerId: string): Promise<SlotEntity | null> {
  return this.create({
    trainerId: trainerId, 
    weeklyAvailability: {
      monday: [], tuesday: [], wednesday: [], thursday: [],
      friday: [], saturday: [], sunday: []
    },
    blockedSlots: []
  });
}

  async updateWeeklyAvailability(trainerId: string, weeklyAvailability: any): Promise<void> {
    await this.model.findOneAndUpdate(
      { trainerId },
      { $set: { weeklyAvailability } },
    );
  }

  async addBlockedSlot(trainerId: string, blockedSlot: any): Promise<SlotEntity | null> {
    const doc = await this.model.findOneAndUpdate(
      { trainerId },
      { $push: { blockedSlots: blockedSlot } },
      { new: true }
    );
    return doc ? this.toEntity(doc) : null;
  }
}

