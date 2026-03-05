import {WalletTransactionInputDTO,WalletDetailsResponseDTO } from "application/dto/wallet/WalletTransactionsDTO"

export interface IGetWalletUseCase{
    execute( payload:WalletTransactionInputDTO):Promise<WalletDetailsResponseDTO>
}