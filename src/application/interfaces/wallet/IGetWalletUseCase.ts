import {WalletTransactionInputDTO } from "application/dto/wallet/WalletTransactionsDTO"
import { PaginationOutputDTO } from "application/dto/common/PaginationDto"
export interface IGetWalletUseCase<responseDTO>{
    execute( payload:WalletTransactionInputDTO):Promise<PaginationOutputDTO<responseDTO>>
}