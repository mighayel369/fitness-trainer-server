import { PaginationInputDTO } from "../common/PaginationDto";

export interface WalletTransactionInputDTO extends Omit<PaginationInputDTO,"filter"> {
  ownerId: string;
}

export interface TransactionDTO {
  type: "credit" | "debit";
  amount: number;
  source: "booking" | "refund" | "admin";
  bookingId?: string;
  createdAt: string;
}

export interface WalletHoldDTO {
  bookingId: string;
  amount: number;
  status: string;
}

export interface WalletDetailsDTO {
  balance: number;
  holds: WalletHoldDTO[];
  transactions: TransactionDTO[];
}