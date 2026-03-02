import { Request, Response ,NextFunction} from 'express';
import { inject, injectable } from 'tsyringe';
import { HttpStatus } from 'utils/HttpStatus';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { IRegisterUseCase } from 'application/interfaces/auth/i-register.usecase';
import { RegisterResponseDTO,UserRegisterRequestDTO } from 'application/dto/auth/register.dto';
import { ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { ISendPasswordResetLinkUseCase } from 'application/interfaces/auth/i-send-password-reset-link.usecase';
import { IUpdateProfilePicture } from 'application/interfaces/common/i-update-profile-picture.usecase';
import { IGetWalletUseCase } from 'application/interfaces/wallet/IGetWalletUseCase';
import { IChangePasswordUseCase } from 'application/interfaces/auth/i-change-password.usecase';
import config from 'config';
import { AppError } from 'domain/errors/AppError';
import { ICancelBooking } from 'application/interfaces/booking/i-cancel-booking.usecase';
import { LoginRequestDTO ,LoginResponseDTO} from 'application/dto/auth/login.dto';
import { WalletDetailsDTO,WalletTransactionInputDTO } from 'application/dto/wallet/WalletTransactionsDTO';
import { ChangePasswordRequestDTO,ResetPasswordTokenBasedDTO } from 'application/dto/auth/change-password.dto';
import { IFetchUserDetailsUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { UserProfileDTO } from 'application/dto/user/user-details.dto';
import { IUpdateUserProfileUseCase } from 'application/interfaces/user/i-update-user-profile.usecase';
import { UpdateUserProfileDTO, UserProfileUpdateRequestDTO } from 'application/dto/user/update-user-profile.dto';
import { UpdateProfilePictureRequestDTO } from 'application/dto/common/update-profile-picture.dto.';
import { IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { FetchAllTrainersRequestDTO, FetchAllClientTrainersResponseDTO } from 'application/dto/trainer/fetch-all-trainers.dto';
import { IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { UserTrainerViewDTO } from 'application/dto/trainer/fetch-trainer-details.dto';
import { TrainerFilter } from 'domain/entities/TrainerEntity';
import { IFetchTrainerAvailableSlotsUseCase } from 'application/interfaces/slot/i-fetch-trainer-available-slots.usecase';
import { FetchAvailableSlotsRequestDTO } from 'application/dto/slot/fetch-trainer-available-slots.dto';
import { IFetchAllBookingsUseCase } from 'application/interfaces/booking/i-fetch-all-bookings.usecase';
import { FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO } from 'application/dto/booking/fetch-all-bookings.dto';
import { IFetchBookingDetailsForClient } from 'application/interfaces/booking/i-fetch-booking-details.usecase';
import { UserBookingDetailsResponseDTO } from 'application/dto/booking/fetch-booking-details.dto';
import { IInitiateOnlinePayment } from 'application/interfaces/booking/i-initiate-online-payment.usecase';
import { CreateOnlinePaymentRequestDTO, OnlinePaymentOrderResponseDTO } from 'application/dto/booking/online-payment.dto';
import { IFinalizeBookingUseCase } from 'application/interfaces/booking/i-finalize-booking.usecase';
import { FinalizeBookingRequestDTO } from 'application/dto/booking/finalize-booking.dto';
import { RescheduleRequestDTO } from 'application/dto/booking/reschedule-request.dto';
import { IRequestBookingRescheduleUseCase } from 'application/interfaces/booking/i-request-booking-reschedule.usecase';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
@injectable()
export class UserController {
  constructor(
    @inject("UserRegisterUseCase") private _userRegisterUsecase: IRegisterUseCase<UserRegisterRequestDTO>,
    @inject("UserLoginUseCase") private _userLoginUsecase: ILoginUseCase,
    @inject("IResetPasswordUseCase") private resetPasswordUseCase: IChangePasswordUseCase<ResetPasswordTokenBasedDTO>,
    @inject("ISendResetMailUseCase") private sendResetMailUseCase: ISendPasswordResetLinkUseCase,
    @inject("FetchUserProfileUseCase") private _findUserDetails: IFetchUserDetailsUseCase<UserProfileDTO>,
    @inject("IUpdateUserProfileUseCase") private _updateUserData: IUpdateUserProfileUseCase,
    @inject("FindAllClientTrainersUseCase") private _findAllClientTrainers:IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO>,
    @inject("FetchTrainerDetailsForClient") private _findTrainerDetails: IFetchTrainerDetails<UserTrainerViewDTO>,
    @inject("UpdateUserProfilePicture") private readonly _updateUserProfilePic: IUpdateProfilePicture,
    @inject("FetchAvailableSlotUseCase") private _generateTrainerSlot:IFetchTrainerAvailableSlotsUseCase,
     @inject("GetWalletUseCase") private _getUserWalletUseCase:IGetWalletUseCase<WalletDetailsDTO>,
     @inject("FetchUserBookingUseCase") private _fetchUserBooking:IFetchAllBookingsUseCase<FetchAllUserBookingRequestDTO,FetchAllUserBookingsResponseDTO>,
    @inject("ChangeUserPasswordUseCase") private _changePasswordUseCase:IChangePasswordUseCase<ChangePasswordRequestDTO>,
    @inject("ICreateOrderUseCase") private _initiatePaymentUseCase:IInitiateOnlinePayment,
    @inject("IVerifyPaymentUseCase") private _finalizeBookingUseCase:IFinalizeBookingUseCase,
    @inject("FetchBookingDetails") private _getBookingDetailsUseCase:IFetchBookingDetailsForClient,
    @inject("RequestReschedule") private _requestForRescheduleUseCase: IRequestBookingRescheduleUseCase,
    @inject("CancelUserBookingUseCase") private _cancelUserBookingUseCase:ICancelBooking
  ) {}

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


login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    const input: LoginRequestDTO = req.body;
    
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


forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
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

resetPassword = async (req: Request, res: Response, next: NextFunction) => {
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

verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const user = await this._findUserDetails.execute(id);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

getUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const user:UserProfileDTO = await this._findUserDetails.execute(id);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
      user
    });
  } catch (error) {
    next(error);
  }
};

getFullUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const user:UserProfileDTO = await this._findUserDetails.execute(id);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
      userData: user
    });
  } catch (error) {
    next(error);
  }
};


updateUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    console.log(req.body)
    let {name,phone,address,gender,age}=req.body
   let data:UpdateUserProfileDTO= {
        name,
        phone,
        address,
        gender,
        age: age ? Number(age) : undefined
      }
    const input: UserProfileUpdateRequestDTO = {
      userId: id,
      data
    };
    console.log(input)

    await this._updateUserData.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE.PROFILE_DATA_UPDATED
    });
  } catch (error) {
    next(error);
  }
};

listTrainers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Number(req.query.pageNO) || 1);
    const search = req.query.search?.toString() || "";

    const filters: TrainerFilter = {
      gender: req.query.gender as TrainerFilter['gender'], 
      serviceId: req.query.services as string,
      sort: req.query.sort as TrainerFilter['sort']
    };
    let input:FetchAllTrainersRequestDTO={
      searchQuery:search,
      currentPage:page,
      limit:5,
      filter:filters
    }
    const result:FetchAllClientTrainersResponseDTO = await this._findAllClientTrainers.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.TRAINER.TRAINERS_LISTED,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

getTrainerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const trainer:UserTrainerViewDTO = await this._findTrainerDetails.execute(id);
    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.TRAINER.TRAINER_DETAILS_FETCHED,
      trainer
    });
  } catch (err) {
    next(err);
  }
};

  logot=async(req:Request,res:Response)=>{
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

updateProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id?: string })?.id;

    if (!userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!req.file) {
      throw new AppError(ERROR_MESSAGES.IMAGE_FILE_MISSING, HttpStatus.BAD_REQUEST);
    }

    const input: UpdateProfilePictureRequestDTO = {
      id: userId,
      profilePic: req.file
    };

    const imageUrl = await this._updateUserProfilePic.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE.PROFILE_PICTURE_UPDATED,
      data: { imageUrl }
    });
  } catch (error) {
    next(error);
  }
};


fetchTrainerSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trainerId, date } = req.body;

    if (!trainerId || !date) {
      throw new AppError(ERROR_MESSAGES. MISSING_REQUIRED_SLOTS_DATA, HttpStatus.BAD_REQUEST);
    }
    let input:FetchAvailableSlotsRequestDTO={
      trainerId,
      date
    }
    const slots = await this._generateTrainerSlot.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.TRAINER.TRAINER_SLOTS_FETCHED,
      data: slots
    });
  } catch (err) {
    next(err);
  }
};

fetchUserWallet = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { id } = req.user as { id: string };
    const { page, limit, search } = req.query;
    const input:WalletTransactionInputDTO={
      ownerId: id,
      currentPage: Number(page) || 1,
      limit: Number(limit) || 10,
      searchQuery: (search as string) || ""
    }
    const result = await this._getUserWalletUseCase.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.WALLET.WALLET_DETAILS_FETCHED,
      ...result
    });
    return
  } catch (err) {
    next(err);
  }
}



fetchUserBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    let input:FetchAllUserBookingRequestDTO={
      userId:id,
      limit:5,
      currentPage: Number(req.query.pageNO) || 1,
      searchQuery:(req.query.search as string) || "",
      filter:{}
    }
    const result:FetchAllUserBookingsResponseDTO = await this._fetchUserBooking.execute(input);
    console.log(result)
    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.BOOKING.USER_BOOKINGS,
      bookingData: result.data,
      totalPages: result.total
    });
  } catch (err) {
    next(err);
  }
};
changePassword = async (req: Request, res: Response, next: NextFunction) => {
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

initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: CreateOnlinePaymentRequestDTO = {
      trainerId: req.body.trainerId,
      serviceId: req.body.serviceId,
      date: req.body.date,
      time: req.body.time,
      amount: req.body.amount
    };

    const orderData:OnlinePaymentOrderResponseDTO = await this._initiatePaymentUseCase.execute(input);

    res.status(200).json({
      success: true,
      message:SUCCESS_MESSAGES.PAYMENT.PAYMENT_REQUEST_INITIATED,
      ...orderData
    });
  } catch (error) {
    next(error);
  }
};

verifyAndBookTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.user as { id: string };
    let input:FinalizeBookingRequestDTO={
      ...req.body,
      userId
    }
    await this._finalizeBookingUseCase.execute(input);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.BOOKING.BOOKING_SUCCESSFULL,
    });
  } catch (error) {
    next(error);
  }
};

fetchBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const booking:UserBookingDetailsResponseDTO = await this._getBookingDetailsUseCase.execute(id);

    if (!booking) {
       res.status(404).json({ success: false, message: "Booking not found" });
       return
    }

    res.status(200).json({
      success: true,
      message:SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
      data: booking
    });
    return
  } catch (err) {
    next(err);
  }
}

requestReschedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as { id: string };
      const { newDate, newTimeSlot, bookingId } = req.body;

      if (!id) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED,HttpStatus.UNAUTHORIZED);
      let input:RescheduleRequestDTO={
        bookingId,
        newDate,
        newTimeSlot
      }
     await this._requestForRescheduleUseCase.execute(input);

      res.status(HttpStatus.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_REQUEST_INITIATED,
      });
    } catch (error: any) {
      next(error);
    }
  }

cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.user as { id: string };
    if (!userId) throw new AppError("Unauthorized", 401);

    const { bookingId } = req.params;
    await this._cancelUserBookingUseCase.execute(bookingId);

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.BOOKING.BOOKING_CANCELLED
    });
    return
  } catch (err: any) {
    next(err);
  }
}

}

