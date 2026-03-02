
import { inject, injectable } from "tsyringe";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { PaginationOutputDTO } from "application/dto/common/PaginationDto";
import { IGetWalletUseCase } from "application/interfaces/wallet/IGetWalletUseCase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { WalletMapper } from "application/mappers/WalletTransactionMapper";
import { WalletTransactionInputDTO } from "application/dto/wallet/WalletTransactionsDTO";
import { WalletDetailsDTO } from "application/dto/wallet/WalletTransactionsDTO";
@injectable()
export class GetWalletUseCase implements IGetWalletUseCase<WalletDetailsDTO> {
  constructor(
    @inject("WalletRepo") private readonly _walletRepo: IWalletRepo
  ) {}

  async execute(payload: WalletTransactionInputDTO): Promise<PaginationOutputDTO<WalletDetailsDTO>> {
    const { ownerId, currentPage, limit } = payload;

    const result = await this._walletRepo.getWalletWithPaginatedTransactions(
      ownerId,
      currentPage,
      limit
    );

    if (!result) {
      const newWallet = await this._walletRepo.createWallet(ownerId);
      return {
        data: [WalletMapper.toWalletDetailsDTO(newWallet)],
        total: 0
      };
    }

    const mappedData = WalletMapper.toWalletDetailsDTO(result.wallet);

    return {
      data: [mappedData], 
      total: Math.ceil(result.totalTransactions/limit)
    };
  }
}