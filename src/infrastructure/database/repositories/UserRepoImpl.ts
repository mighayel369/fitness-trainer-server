import { injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import UserModel, { IUser } from "../models/UserModel";
import { BaseRepository } from "./BaseRepository";
import { UserEntity } from "domain/entities/UserEntity";
import { UserMapper } from "../mappers/UserMapper";
import { Model } from "mongoose";

@injectable()
export class UserRepoImpl extends BaseRepository<IUser, UserEntity> implements IUserRepo{
  protected model: Model<IUser> = UserModel; 
  protected toEntity = UserMapper.toEntity;

  async registerUser(payload: UserEntity): Promise<UserEntity|null> {
    let doc= await this.model.create({...payload});
      return doc ? this.toEntity(doc) : null;
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ email });
  }

  async findUserById(id: string): Promise<UserEntity | null> {
   return this.findOne({ userId: id, role: "user" });
  }

async findAllUsers(page: number, limit: number, search = "", filters: Record<string, any> = {}): Promise<{ data: UserEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const regex = new RegExp(search, "i");

    const matchQuery = {
      ...filters,
      role: "user",
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } }
      ]
    };

    const results = await this.model.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }]
        }
      }
    ]);

    const items: IUser[] = results[0]?.data || [];
    const total = results[0]?.totalCount[0]?.count || 0;

    return {
      data: items.map(this.toEntity),
      totalCount: Math.ceil(total / limit),
    };
  }

  async getTotalUsersCount(): Promise<number> {
    return this.model.countDocuments({role:"user",status:true});
  }


async updateUserStatus(id: string, newStatus: boolean): Promise<void> {
  await this.model.findOneAndUpdate(
    {userId:id },
    { $set: { status: newStatus } }
  );  
}
  async updateUserData(id: string, data:UserEntity): Promise<void> {
  await this.model.findOneAndUpdate(
    { userId: id }, 
    { $set: data }
  );
}


async removeUser(id: string): Promise<boolean> {
    const result = await this.model.findOneAndDelete({userId:id});
    return !!result;
}

async updatePassword(id: string, hashedPassword: string): Promise<void> {
  await this.model.findOneAndUpdate({userId:id}, { password: hashedPassword });
}

async updateResetToken(userId: string, token?: string, expires?: number): Promise<void> {
  await this.model.findOneAndUpdate(
    { userId }, 
    { 
      passwordResetToken: token, 
      passwordResetExpires: expires 
    }
  );
}


async findByResetToken(token: string): Promise<UserEntity | null> {
  const userDoc = await this.model.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!userDoc) {
    return null;
  }
  return UserMapper.toEntity(userDoc);
}

async countUsers():Promise<number>{
  let res=await this.model.find({status:true,  role: "user"}).countDocuments()
  return res
}

async getUserGrowthData(): Promise<{
  date: string;
  count: number;
}[]> {

  return await this.model.aggregate<{
    date: string;
    count: number;
  }>([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } },
    {
      $project: {
        date: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);
}

async updateUserProfilePicture(userId: string, profilePic: string): Promise<void> {
  await this.model.findOneAndUpdate({userId},{profilePic})
}
}