import { injectable } from "tsyringe";
import { IAdminRepo } from "domain/repositories/IAdminRepo";
import Admin,{IAdminDocument} from "../models/AdminModel";
import { BaseRepository } from "./BaseRepository";
import { AdminEntity } from "domain/entities/AdminEntity";
import { AdminMapper } from "../mappers/AdminMapper";
import { Model } from "mongoose";
@injectable()
export class AdminRepoImpl extends BaseRepository<IAdminDocument, AdminEntity> implements IAdminRepo {
  protected model:Model<IAdminDocument> = Admin;
  protected toEntity = AdminMapper.toEntity;

  async findAdminByEmail(email: string): Promise<AdminEntity | null> {
    return this.findOne({ email });
  }
}