import { PaginationInputDTO ,PaginationOutputDTO} from "../common/PaginationDto";

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


export interface WalletDetailsResponseDTO extends PaginationOutputDTO<TransactionDTO> {
  balance: number;
}