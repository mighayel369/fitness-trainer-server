import { injectable } from "tsyringe";
import { Model } from "mongoose";
import { IProgramRepo } from "domain/repositories/IProgramRepo";
import ProgramModel, { IProgram } from "../models/ProgramModel";
import { BaseRepository } from "./BaseRepository";
import { ProgramEntity } from "domain/entities/ProgramEntity";
import { ProgramMapper } from "../mappers/ProgramMapper";

@injectable()
export class ProgramRepoImpl
  extends BaseRepository<IProgram, ProgramEntity>
  implements IProgramRepo
{
  protected model: Model<IProgram> = ProgramModel;
  protected toEntity = ProgramMapper.toEntity;

  async saveProgram(payload: ProgramEntity): Promise<void> {
    await this.model.create(payload);
  }

  async findProgramInventory(
    page: number,
    limit: number,
    search = "",
    filters: Record<string, any> = {}
  ): Promise<{ data: ProgramEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const regex = new RegExp(search, "i");

    const matchQuery = {
      ...filters,
      isArchived: false,
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
      ],
    };

    const results = await this.model.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const items: IProgram[] = results[0]?.data || [];
    const total = results[0]?.totalCount[0]?.count || 0;

    return {
      data: items.map((doc) => this.toEntity(doc)),
      totalCount: total
    };
  }


  async findProgramById(id: string): Promise<ProgramEntity | null> {
    const doc = await this.model.findOne({ programId: id, isArchived: false });
    return doc ? this.toEntity(doc) : null;
  }

  async updateProgramSpecs(
    data: Partial<ProgramEntity>
  ): Promise<ProgramEntity | null> {
    const { programId } = data;
    const doc = await this.model.findOneAndUpdate(
      { programId }, 
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return doc ? this.toEntity(doc) : null;
  }

  async updateProgramVisibility(programId: string, status: boolean): Promise<ProgramEntity | null> {
    const doc = await this.model.findOneAndUpdate(
      { programId }, 
      { $set: { status } },
      { new: true }
    );
    return doc ? this.toEntity(doc) : null;
  }

  async archiveProgram(id: string): Promise<ProgramEntity> {
    const result = await this.model.findOneAndUpdate(
      { programId: id },
      { $set: { isArchived: true, status: false, archivedAt: new Date() } },
      { new: true }
    );
    
    if (!result) throw new Error("Program not found");
    return this.toEntity(result);
  }

  async findPublishedPrograms(): Promise<ProgramEntity[]> {
    const docs = await this.model.find({ status: true, isArchived: false });
    return docs.map(doc => this.toEntity(doc));
  }
}