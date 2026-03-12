import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { LoginRequestDTO,LoginResponseDTO } from 'application/dto/auth/login.dto';
import { IRegisterUseCase } from 'application/interfaces/auth/i-register.usecase';
import { RegisterResponseDTO,UserRegisterRequestDTO,TrainerRegisterRequestDTO } from 'application/dto/auth/register.dto';
import { ISendPasswordResetLinkUseCase } from 'application/interfaces/auth/i-send-password-reset-link.usecase';
import { IChangePasswordUseCase } from 'application/interfaces/auth/i-change-password.usecase';
import { ChangePasswordRequestDTO,ResetPasswordTokenBasedDTO } from 'application/dto/auth/change-password.dto';
import { IReapplyTrainer } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { ReapplyTrainerRequestDTO, ReapplyTrainerDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { RefreshTokenResponseDTO } from "application/dto/public/refresh-token.response.dto";
import { IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";
import { IReSendOtpUseCase } from "application/interfaces/public/i-resend-otp.usecase";
import { IRefreshAccessTokenUseCase } from "application/interfaces/public/i-refresh-access-token.usecase";
import { IVerifySession } from 'application/interfaces/auth/i-verify-session.usecase';
import { ClientSessionDTO, TrainerSessionDTO } from 'application/dto/auth/verify-session.dto';
@injectable()
export class AuthController {
  constructor(
    @inject("AdminLoginUsecase") private _adminLoginUseCase: ILoginUseCase,
    @inject("UserRegisterUseCase") private _userRegisterUsecase: IRegisterUseCase<UserRegisterRequestDTO>,
    @inject("UserLoginUseCase") private _userLoginUsecase: ILoginUseCase,
    @inject("ISendResetMailUseCase") private sendResetMailUseCase: ISendPasswordResetLinkUseCase,
    @inject("IResetPasswordUseCase") private resetPasswordUseCase: IChangePasswordUseCase<ResetPasswordTokenBasedDTO>,
    @inject("ChangeUserPasswordUseCase") private _changePasswordUseCase:IChangePasswordUseCase<ChangePasswordRequestDTO>,
    @inject("TrainerRegisterUseCase") private readonly _trainerRegisterUsecase: IRegisterUseCase<TrainerRegisterRequestDTO>,
    @inject("TrainerLoginUseCase") private readonly _trainerLoginUsecase: ILoginUseCase,
    @inject("TrainerReapplyUsecase") private readonly _trainerReapplyUsecase: IReapplyTrainer,
    @inject("IRefreshAccessTokenUseCase") private _refreshTokenUseCase: IRefreshAccessTokenUseCase,
    @inject("VerifyUserAccountUseCase") private _verifyUserAccountUsecase: IVerifyAccountUseCase,
    @inject("VerifyTrainerAccountUseCase") private _verifyTrainerAccountUsecase: IVerifyAccountUseCase,
    @inject("IReSendOtpUseCase") private _resendOtpUseCase: IReSendOtpUseCase,
    @inject("VerifyClientSession") private _getClientIdentityUseCase: IVerifySession<ClientSessionDTO>,
    @inject("VerifyTrainerSession") private _getTrainerIdentityUseCase: IVerifySession<TrainerSessionDTO>,
  ) { }

  AdminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input:LoginRequestDTO = req.body

      const result:LoginResponseDTO = await this._adminLoginUseCase.execute(input);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: config.COOKIE_MAX_AGE
      });

      res.status(HttpStatus.OK).json({
        success: true,
        accessToken:result.accessToken,
        message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESSFULL
      });
    } catch (error) {
      next(error);
    }
  };

  UserLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const input: LoginRequestDTO = req.body
    
    const result: LoginResponseDTO = await this._userLoginUsecase.execute(input);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: config.COOKIE_MAX_AGE
    });

    res.status(HttpStatus.OK).json({ 
      success: true, 
      accessToken: result.accessToken
    });
  } catch (error) {
    next(error);
  }
};

TrainerLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    const input: LoginRequestDTO = req.body;
    
    const result: LoginResponseDTO = await this._trainerLoginUsecase.execute(input);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: config.COOKIE_MAX_AGE
    });

    res.status(HttpStatus.OK).json({ 
      success: true, 
      message:SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESSFULL,
      accessToken: result.accessToken
    });
  } catch (error) {
    next(error);
  }
};

RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input:UserRegisterRequestDTO = req.body;

    const result:RegisterResponseDTO = await this._userRegisterUsecase.execute(input);
console.log(result)
    res.status(HttpStatus.CREATED).json({ 
      success: true,
      message: SUCCESS_MESSAGES.USER.USER_REGISTERED,
      email: result.email 
    });
  } catch (error) {
    next(error);
  }
};

RegisterTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, gender, experience, pricePerSession } = req.body;
    console.log(req.body)
    const programs = Array.isArray(req.body.programs) 
      ? req.body.programs 
      : req.body["programs[]"] ? [].concat(req.body["programs[]"]) : [];

    const languages = Array.isArray(req.body.languages) 
      ? req.body.languages 
      : req.body["languages[]"] ? [].concat(req.body["languages[]"]) : [];

    if (!req.file) {
      throw new AppError(ERROR_MESSAGES.CERTIFICATE_MISSING, HttpStatus.BAD_REQUEST);
    }

    const trainerData: TrainerRegisterRequestDTO = {
      name,
      email,
      password,
      gender,
      experience:Number(experience),
      pricePerSession:Number(pricePerSession),
      programs,
      languages
    };

    const result:RegisterResponseDTO = await this._trainerRegisterUsecase.execute(trainerData, req.file);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.AUTH.TRAINER_REGISTERATION_SUCCESSFULL,
      email: result.email,
    });
  } catch (err) {
    next(err);
  }
};

ReApplyTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    const parseArray = (key: string) => {
      const val = req.body[`${key}[]`] || req.body[key];
      return Array.isArray(val) ? val : val ? [val] : [];
    };

    const reapplyDTO: ReapplyTrainerDTO = {
      name: req.body.name,
      gender: req.body.gender,
      experience: Number(req.body.experience),
      pricePerSession: Number(req.body.pricePerSession),
      languages: parseArray('languages'),
      programs: parseArray('programs'),
      certificate: req.file as Express.Multer.File,
    };

    const input: ReapplyTrainerRequestDTO = {
      trainerId: id,
      data: reapplyDTO,
    };

    const result = await this._trainerReapplyUsecase.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.TRAINER.REAPPLY_SUCCESSFULL,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

ForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await this.sendResetMailUseCase.execute(email);

    res.status(HttpStatus.OK).json({ 
      success: true, 
      message: SUCCESS_MESSAGES.USER.RESET_LINK_SENTED
    });
  } catch (error) {
    next(error);
  }
};

ResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    let payload:ResetPasswordTokenBasedDTO={
      token,
      newPassword:password
    }
     await this.resetPasswordUseCase.execute(payload);

    res.status(HttpStatus.OK).json({ 
      success: true, 
      message:SUCCESS_MESSAGES.USER.PASSWORD_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

ChangePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string }).id;
    
    const { oldPassword, newPassword } = req.body.payload;
    let payload:ChangePasswordRequestDTO={
      oldPassword,
      newPassword,
      userId
    }
    await this._changePasswordUseCase.execute(payload);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.AUTH.PASSWORD_UPDATED
    });
  } catch (error) {
    next(error);
  }
};

 RefreshToken = async (req: Request, res: Response,next:NextFunction) => {
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

VerifyTrainerAccount = async (req: Request, res: Response, next: NextFunction) => {
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

VerifyUserAccount = async (req: Request, res: Response, next: NextFunction) => {
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

ResendOtp = async (req: Request, res: Response, next: NextFunction) => {
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

verifyClientSession = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user as { id: string };
    const user:ClientSessionDTO = await this._getClientIdentityUseCase.execute(id); 
    
    res.status(HttpStatus.OK).json({
        success: true,
        user
    });
};


verifyTrainerSession = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user as { id: string };
    const trainer:TrainerSessionDTO = await this._getTrainerIdentityUseCase.execute(id); 
    
    res.status(HttpStatus.OK).json({
        success: true,
        trainer
    });
};


  Logot=async(req:Request,res:Response)=>{
    try{
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.COOKIE_MAX_AGE
    });

     res.status(HttpStatus.OK).json({
       message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS 
      });
    }catch{
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    }
  }
}