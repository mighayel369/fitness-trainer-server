
import { WalletEntity, TransactionType, TransactionSource, HoldStatus } from "domain/entities/WalletEntity";
import { IWallet } from "../models/WalletModel";

export class WalletMapper {
  static toEntity(doc: IWallet): WalletEntity {
    return new WalletEntity(
      doc.ownerId,
      doc.balance,
      (doc.holds || []).map((h) => ({
        bookingId: h.bookingId,
        amount: h.amount,
        status: h.status as HoldStatus,
        createdAt: h.createdAt
      })),
      (doc.transactions || []).map((t) => ({
        type: t.type,
        amount: t.amount,
        source: t.source,
        bookingId: t.bookingId, 
        createdAt: t.createdAt
      }))
    );
  }
}