
import { WalletEntity } from "domain/entities/WalletEntity";

export class WalletMapper {
  static toEntity(doc: any): WalletEntity {
    return new WalletEntity(
      doc.ownerId,
      doc.balance,
      doc.holds.map((h: any) => ({
        bookingId: h.bookingId,
        amount: h.amount,
        status: h.status,
        createdAt: h.createdAt
      })),
      doc.transactions.map((t: any) => ({
        type: t.type,
        amount: t.amount,
        source: t.source,
        bookingId: t.bookingId?.toString(),
        createdAt: t.createdAt
      }))
    );
  }
}