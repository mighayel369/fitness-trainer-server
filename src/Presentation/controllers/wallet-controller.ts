
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { WalletDetailsResponseDTO, WalletTransactionInputDTO } from 'application/dto/wallet/WalletTransactionsDTO';
import { IGetWalletUseCase } from 'application/interfaces/wallet/IGetWalletUseCase';

@injectable()
export class WalletController{
    constructor(
    @inject("GetWalletUseCase") private _getOwnerWalletUseCase: IGetWalletUseCase,
    ){}

      fetchOwnerWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { id } = req.user as { id: string };
          const { limit, search } = req.query;
          const input: WalletTransactionInputDTO = {
            ownerId: id,
            currentPage:Math.max(1, Number(req.query.pageNO) || 1),
            limit: Number(limit) || 10,
            searchQuery: (search as string) || ""
          }
          const result:WalletDetailsResponseDTO = await this._getOwnerWalletUseCase.execute(input);
    
          res.status(HttpStatus.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.WALLET.WALLET_DETAILS_FETCHED,
            wallet:result
          });
        } catch (err) {
          next(err);
        }
      };
}