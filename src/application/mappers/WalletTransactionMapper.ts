import { WalletEntity,WalletHold,WalletTransaction } from "domain/entities/WalletEntity";
import { WalletDetailsDTO,TransactionDTO,WalletHoldDTO } from "application/dto/wallet/WalletTransactionsDTO";

export class WalletMapper {
  static toTransactionDTO(transaction:WalletTransaction ): TransactionDTO {
    return {
      type: transaction.type,
      amount: transaction.amount,
      source: transaction.source,
      bookingId: transaction.bookingId?.toString(),
      createdAt: transaction.createdAt.toISOString(),
    };
  }

  static toHoldDTO(hold: WalletHold): WalletHoldDTO {
    return {
      bookingId: hold.bookingId.toString(),
      amount: hold.amount,
      status: hold.status
    };
  }

  static toWalletDetailsDTO(entity: WalletEntity): WalletDetailsDTO {
    return {
      balance: entity.balance,
      holds: entity.holds.map(this.toHoldDTO),
      transactions: entity.transactions.map(this.toTransactionDTO),
    };
  }
}