import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { HttpStatus } from 'core/HttpStatus';
import { ERROR_MESSAGES } from 'core/ErrorMessage';
import { UserEntity } from 'domain/entities/UserEntity';
import { IRegisterUseCase } from 'domain/usecases/IRegisterUseCase';
import { CreateParamUser } from 'domain/entities/UserEntity';
import { ILoginUseCase } from 'domain/usecases/ILoginUseCase';
import { ISendOtpUseCase } from 'domain/usecases/ISendOtpUseCase';
import { IVerifyOtpUseCase } from 'domain/usecases/IVerifyOtpUseCase';
import { IResetPasswordUseCase } from 'domain/usecases/IResetPasswordUseCase';
import { IRefreshAccessTokenUseCase } from 'domain/usecases/IRefreshAccessTokenUseCase';
import { ISendResetMailUseCase } from 'domain/usecases/ISendResetMailUseCase';
import { IFindByIdUseCase } from 'domain/usecases/IFindByIdUseCase';
import { IUpdatableProfile } from 'domain/usecases/IUpdatableProfileUseCase';
import { IFindAllUseCase } from 'domain/usecases/IFindAllUseCase';
import { TrainerEntity } from 'domain/entities/TrainerEntity';
import config from 'config';
@injectable()
export class UserController {
  constructor(
    @inject("UserRegisterUseCase") private _userRegisterUsecase: IRegisterUseCase<CreateParamUser>,
    @inject("ISendOtpUseCase") private sendOtpUseCase: ISendOtpUseCase,
    @inject("IVerifyOtpUseCase") private verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("UserLoginUseCase") private _userLoginUsecase: ILoginUseCase,
    @inject("IResetPasswordUseCase") private resetPasswordUseCase: IResetPasswordUseCase,
    @inject("IRefreshAccessTokenUseCase") private refreshUserTokenUseCase: IRefreshAccessTokenUseCase,
    @inject("ISendResetMailUseCase") private sendResetMailUseCase: ISendResetMailUseCase,
    @inject("FindUserByIdUseCase") private _findUserDetails: IFindByIdUseCase<UserEntity>,
    @inject("UserProfileUseCase") private _updateUserData: IUpdatableProfile<UserEntity>,
    @inject("FindAllTrainersUseCase") private _findTrainers: IFindAllUseCase<TrainerEntity>,
    @inject("FindTrainerByIdUseCase") private _findTrainerDetails: IFindByIdUseCase<TrainerEntity>,
  ) {}

  createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const result = await this._userRegisterUsecase.execute({ name, email, password, role: 'user' });

      if (!result.success) {
       res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: result.message });
       return
      }
      res.status(HttpStatus.OK).json({ result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    }
  };

  sendOtp = async (req: Request, res: Response) => {
    try {
      const { email, role } = req.body;
      const result = await this.sendOtpUseCase.execute(email, role);

      if (!result) {
         res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.OTP_FAILED });
         return 
      }
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const role = await this.verifyOtpUseCase.execute(email, otp);

      if (role) {
        res.status(HttpStatus.OK).json({ success: true, role });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.OTP_INVALID });
      }
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this._userLoginUsecase.execute(email, password);

      if (!result.success) {
        const statusMap: Record<string, number> = {
          [ERROR_MESSAGES.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
          [ERROR_MESSAGES.PASSWORD_INCORRECT]: HttpStatus.BAD_REQUEST,
          [ERROR_MESSAGES.USER_BLOCKED]: HttpStatus.FORBIDDEN
        };
        const status = statusMap[result.message!] || HttpStatus.BAD_REQUEST;
         res.status(status).json({ success: false, message: result.message });
         return
      }

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.COOKIE_MAX_AGE
      });

      res.status(HttpStatus.OK).json({ success: true, accessToken: result.accessToken });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    }
  };

  getUserData = async (req: Request, res: Response) => {
    try {
      const { id } = req.user as { id: string; email: string; role: string };
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.ACCOUNT_NOT_VERIFIED });
        return
      }
      const user = await this._findUserDetails.find(id);
      res.status(HttpStatus.OK).json({ user });
    } catch {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const token = await this.resetPasswordUseCase.sendPasswordLink(email);
      const success = await this.sendResetMailUseCase.execute(email, token);

      if (success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.USER_NOT_FOUND });
      }
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const result = await this.resetPasswordUseCase.resetPassword(token, password);

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
        return
      }
      res.status(HttpStatus.OK).json({ success: true, role: result.role });
    } catch {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.SOMETHING_WENT_WRONG });
    }
  };

verifyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
      return;
    }

    const user = await this._findUserDetails.find(id);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    res.status(HttpStatus.OK).json({
      success: true,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};




getFullUserData = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
      return;
    }

    const user = await this._findUserDetails.find(id);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
      return;
    }

    res.status(HttpStatus.OK).json({
      success: true,
      userData: user
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};


updateUserData=async(req:Request,res:Response)=>{
    try{
    const { id } = req.user as { id: string };
    console.log(id)
    const { name, email, phone, address } = req.body;

    if (!id) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
      return
    }

    const result=await this._updateUserData.updateData(id,{name,email,phone:phone||"",address:address||""})
    res.status(HttpStatus.OK).json(result)
  }
  catch{
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
  }
}

  refreshUserToken = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING
        });
        return
      }
      const result = await this.refreshUserTokenUseCase.execute(token);
      if (!result.success) {
         res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: result.message });
         return
      }
      res.status(HttpStatus.OK).json({ success: true, accessToken: result.accessToken });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    }
  };


  listTrainers = async (req: Request, res: Response) => {
    try {
      const page = req.query.pageNO ? parseInt(req.query.pageNO as string) : 1;
      const search = req.query.search?.toString() || '';
      const { data, totalPages } = await this._findTrainers.findAll(page, search);
      res.status(HttpStatus.OK).json({ success: true, trainers:data, totalPages });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };


  getTrainerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trainer = await this._findTrainerDetails.find(id); 
    if (!trainer) {
      res.status(404).json({ success: false, message: "Trainer not found" });
      return
    }
    res.status(200).json({ success: true, trainer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

  logot=async(req:Request,res:Response)=>{
    try{
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.COOKIE_MAX_AGE
    });

     res.status(HttpStatus.OK).json({ message: ERROR_MESSAGES.LOGOUT_SUCCESS });
    }catch{
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    }
  }
}
