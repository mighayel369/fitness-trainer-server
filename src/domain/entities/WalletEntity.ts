
export type TransactionType = "credit" | "debit";
export type TransactionSource = "booking" | "refund" | "admin";
export type HoldStatus = "active" | "released" | "converted";

export interface WalletHold {
  bookingId: string;
  amount: number;
  status: HoldStatus;
  createdAt: Date;
}

export interface WalletTransaction {
  type: TransactionType;
  amount: number;
  source: TransactionSource;
  bookingId: string,
  createdAt: Date;
}

export class WalletEntity {
  constructor(
    public readonly ownerId: string,
    public balance: number,
    public holds: WalletHold[],
    public transactions: WalletTransaction[],
  ) {}

}
