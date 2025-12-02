import { injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import TrainerModel, { IUser } from "../models/UserModel";
import { BaseRepository } from "./BaseRepository";
import { TrainerEntity, CreateParamTrainer } from "domain/entities/TrainerEntity";
import { TrainerMapper } from "../mappers/TrainerMapper";
import { Model } from "mongoose";
@injectable()
export class TrainerRepoImpl extends BaseRepository<IUser, TrainerEntity> implements ITrainerRepo {
  protected model: Model<IUser>=TrainerModel
  protected toEntity = TrainerMapper.toEntity;

  async createTrainer(payload: CreateParamTrainer): Promise<TrainerEntity | null> {
    const created = await this.model.create(payload);
    return created ? this.toEntity(created) : null;
  }

  async findTrainerById(id: string): Promise<TrainerEntity | null> {
    return this.findOne({ _id: id, role: "trainer" });
  }

  async findTrainerByEmail(email: string): Promise<TrainerEntity | null> {
    return this.findOne({ email, role: "trainer" });
  }

  async trainerCount(search = ""): Promise<number> {
    const filter = search
      ? { role: "trainer", verified: "accepted", $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : { role: "trainer", verified: "accepted" };

    return this.count(filter);
  }

async updateVerification(id: string, action: string, reason?: string): Promise<TrainerEntity | null> {
  const doc = await this.model.findById(id);
  if (!doc) return null;

  if (action === "accept") {
    doc.verified = "accepted";
    doc.rejectReason = undefined; 
  } else if (action === "decline") {
    doc.verified = "rejected";
    doc.rejectReason = reason || "No reason provided";
  }

  await doc.save();
  return this.toEntity(doc);
}

  async findPendingTrainers(): Promise<TrainerEntity[]> {
    const docs = await this.model.find({ role: "trainer", verified: "pending" });
    return docs.map(this.toEntity);
  }

  async findPendingTrainerDetails(id: string): Promise<TrainerEntity | null> {
    const doc = await this.model.findOne({ _id: id, role: "trainer", verified: "pending" });
    return doc ? this.toEntity(doc) : null;
  }

  async deleteTrainer(id: string): Promise<TrainerEntity | null> {
    const doc = await this.model.findByIdAndDelete(id);
    return doc ? this.toEntity(doc) : null;
  }

async findTrainerByIdAndUpdate(id: string, payload: any): Promise<TrainerEntity | null> {
  const doc = await this.model.findByIdAndUpdate(id, payload, { new: true });
  return doc ? this.toEntity(doc) : null;
}

}
