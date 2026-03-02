import { inject,injectable } from "tsyringe";
import { Request, Response ,NextFunction} from "express";
import { PublicServiceListResponseDTO } from "application/dto/public/fetch-public.services.dto";
import { IFetchPublicServiceUseCase} from "application/interfaces/public/i-fetch-public-services.usecase";
import { HttpStatus } from "utils/HttpStatus";
import { IRefreshAccessTokenUseCase } from "application/interfaces/public/i-refresh-access-token.usecase";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { RefreshTokenResponseDTO } from "application/dto/public/refresh-token.response.dto";
import { IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";
import { IReSendOtpUseCase } from "application/interfaces/public/i-resend-otp.usecase";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";
@injectable()
export class PublicController {
  constructor(
    @inject("IFetchPublicServiceUseCase") private _fetchPublicServices: IFetchPublicServiceUseCase,
    @inject("IRefreshAccessTokenUseCase") private _refreshTokenUseCase: IRefreshAccessTokenUseCase,
    @inject("VerifyUserAccountUseCase") private _verifyUserAccountUsecase:IVerifyAccountUseCase,
     @inject("VerifyTrainerAccountUseCase") private _verifyTrainerAccountUsecase:IVerifyAccountUseCase,
    @inject("IReSendOtpUseCase") private _resendOtpUseCase:IReSendOtpUseCase,
  ) {}

  getPublicServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: PublicServiceListResponseDTO = await this._fetchPublicServices.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message:SUCCESS_MESSAGES.SERVICE.FETCHED,
        data: result.data
      });
    } catch (err) {
      next(err);
    }
  }

    refreshToken = async (req: Request, res: Response,next:NextFunction) => {
      try {
        const token = req.cookies.refreshToken;
        if (!token) {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING
          });
          return
        }
        const result:RefreshTokenResponseDTO = await this._refreshTokenUseCase.execute(token);
        res.status(HttpStatus.OK).json({
           success: true,
            accessToken: result.accessToken
           });
        return
      } catch(error){
       next(error)
      }
    };

verifyTrainerAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp }:VerifyAccountRequestDTO = req.body;

    await this._verifyTrainerAccountUsecase.execute({ email, otp });

    res.status(HttpStatus.OK).json({ 
      success: true, 
      message: SUCCESS_MESSAGES.AUTH.AUTHORIZED_SUCCESSFULLY
    });
  } catch (error) {
    next(error);
  }
};

verifyUserAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp }:VerifyAccountRequestDTO = req.body;

    await this._verifyUserAccountUsecase.execute({ email, otp });

    res.status(HttpStatus.OK).json({ 
      success: true, 
      message: SUCCESS_MESSAGES.AUTH.AUTHORIZED_SUCCESSFULLY
    });
  } catch (error) {
    next(error);
  }
};

resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role } = req.body;

    await this._resendOtpUseCase.execute({ email, role });

    res.status(HttpStatus.OK).json({ 
      success: true, 
      message: SUCCESS_MESSAGES.AUTH.OTP_SENDED
    });
  } catch (error) {
    next(error);
  }
};
}