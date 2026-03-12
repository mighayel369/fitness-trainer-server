
import { inject, injectable } from "tsyringe";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { PaginationOutputDTO } from "application/dto/common/PaginationDto";
import { IGetWalletUseCase } from "application/interfaces/wallet/IGetWalletUseCase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { WalletMapper } from "application/mappers/WalletTransactionMapper";
import { WalletTransactionInputDTO,WalletDetailsResponseDTO } from "application/dto/wallet/WalletTransactionsDTO";
@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject("WalletRepo") private readonly _walletRepo: IWalletRepo
  ) {}

  async execute(payload: WalletTransactionInputDTO): Promise<WalletDetailsResponseDTO> {
    const { ownerId, currentPage, limit } = payload;

    const result = await this._walletRepo.getWalletWithPaginatedTransactions(
      ownerId,
      currentPage,
      limit
    );

    if (!result) {
      const newWallet = await this._walletRepo.createWallet(ownerId);
      return {
        balance:0,
        data: [],
        activeHoldCount:0,
        total: 0
      };
    }


console.log(result)
    return {
      balance:result.wallet.balance,
      data: result.wallet.transactions.map(t=>WalletMapper.toTransactionDTO(t)),
      activeHoldCount:result.wallet.holds.length, 
      total: Math.ceil(result.totalTransactions/limit)
    };
  }
}