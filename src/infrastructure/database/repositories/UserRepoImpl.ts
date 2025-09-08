import { injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import UserModel, { IUser } from "../models/UserModel";
import { BaseRepository } from "./BaseRepository";
import { UserEntity, CreateParamUser } from "domain/entities/UserEntity";
import { UserMapper } from "../mappers/UserMapper";
import { Model } from "mongoose";

@injectable()
export class UserRepoImpl extends BaseRepository<IUser, UserEntity> implements IUserRepo {
  protected model: Model<IUser> = UserModel; 
  protected toEntity = UserMapper.toEntity;

  async createUser(payload: CreateParamUser): Promise<UserEntity | null> {
    return this.create(payload);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ email });
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.findOne({ _id: id, status: true, role: "user" });
  }

  async updateVerification(email: string): Promise<boolean> {
    const res = await this.model.findOneAndUpdate({ email }, { status: true });
    return !!res;
  }

  async findAllUsers(page = 1, search = "", limit = 5): Promise<UserEntity[]> {
    const skip = (page - 1) * limit;
    const filter = search
      ? { role: "user", $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : { role: "user" };

    const docs = await this.model.find(filter).skip(skip).limit(limit);
    return docs.map(this.toEntity);
  }

  async userCount(search = ""): Promise<number> {
    const filter = search
      ? { role: "user", $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : { role: "user" };
    return this.model.countDocuments(filter);
  }

  async updateUserStatus(id: string, newStatus: boolean): Promise<void> {
    await this.model.findByIdAndUpdate(id, { status: newStatus });
  }

  async updateUserData(id: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
    const updatedDoc = await this.model.findByIdAndUpdate(id, data, { new: true });
    return updatedDoc ? this.toEntity(updatedDoc) : null;
  }
}
