import { WalletEntity } from "domain/entities/WalletEntity";
export interface IWalletRepo {
  createWallet(ownerId: string): Promise<WalletEntity>;
  getWalletWithPaginatedTransactions(
    ownerId: string, 
    page: number, 
    limit: number
  ): Promise<{ wallet: WalletEntity; totalTransactions: number }| null>;
  credit(
    ownerId: string,
    amount: number,
    source: "booking" | "refund",
    bookingId?: string
  ): Promise<WalletEntity | null>;

  holdAmount(
    ownerId: string,
    bookingId: string,
    amount: number
  ): Promise<void>;

  convertHoldToBalance(
    ownerId: string,
    bookingId: string
  ): Promise<WalletEntity | null>;

  releaseHoldWithoutBalance(
    ownerId: string, 
    bookingId: string
  ): Promise<WalletEntity | null>;
}