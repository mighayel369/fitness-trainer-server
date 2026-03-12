
import { injectable } from "tsyringe";
import  { Model } from "mongoose";
import WalletModel, { IWallet } from "../models/WalletModel";
import { BaseRepository } from "./BaseRepository";
import { WalletEntity } from "domain/entities/WalletEntity";
import { WalletMapper } from "../mappers/WalletMapper";
import { IWalletRepo } from "domain/repositories/IWalletRepo";

@injectable()
export class WalletRepoImpl
  extends BaseRepository<IWallet, WalletEntity>
  implements IWalletRepo {

  protected model: Model<IWallet> = WalletModel;
  protected toEntity = WalletMapper.toEntity;

  async createWallet(ownerId: string): Promise<WalletEntity> {
    const wallet = await this.model.create({
      ownerId,
      balance: 0,
      holds: [],
      transactions: []
    });
    return this.toEntity(wallet);
  }

  async credit(
    ownerId: string,
    amount: number,
    source: "booking" | "refund",
    bookingId?: string
  ): Promise<WalletEntity | null> {
    const doc = await this.model.findOneAndUpdate(
      { ownerId },
      {
        $inc: { balance: amount },
        $push: {
          transactions: {
            type: "credit",
            amount,
            source,
            bookingId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    return doc ? this.toEntity(doc) : null;
  }

  async holdAmount(ownerId: string, bookingId: string, amount: number): Promise<void> {
    await this.model.findOneAndUpdate(
      { ownerId },
      { $push: { holds: { bookingId, amount, status: "active" } } }
    );
  }

  async convertHoldToBalance(ownerId: string, bookingId: string): Promise<WalletEntity | null> {
    const walletDoc = await this.model.findOne({ ownerId });
    if (!walletDoc) return null;

    const hold = walletDoc.holds.find(h => h.bookingId.toString() === bookingId && h.status === "active");
    if (!hold) throw new Error("Active hold not found");

    const doc = await this.model.findOneAndUpdate(
      { ownerId },
      {
        $inc: { balance: hold.amount },
        $pull: { holds: { bookingId: bookingId } },
        $push: {
          transactions: {
            type: "credit",
            amount: hold.amount,
            source: "booking",
            bookingId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    return doc ? this.toEntity(doc) : null;
  }

  async releaseHoldWithoutBalance(ownerId: string, bookingId: string): Promise<WalletEntity | null> {
    const doc = await this.model.findOneAndUpdate(
      { ownerId },
      { $pull: { holds: { bookingId: bookingId } } },
      { new: true }
    );
    return doc ? this.toEntity(doc) : null;
  }

  async getWalletWithPaginatedTransactions(ownerId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const result = await this.model.aggregate([
      { $match: { ownerId } },
      {
        $project: {
          ownerId: 1,
          balance: 1,
          holds: 1,
          totalTransactions: { $size: "$transactions" },
          transactions: { $slice: [{ $reverseArray: "$transactions" }, skip, limit] }
        }
      }
    ]);

    if (!result || result.length === 0) return null;

    const data = result[0];
    console.log(data)
    return {
      wallet: this.toEntity(data),
      totalTransactions: data.totalTransactions
    };
  }
}