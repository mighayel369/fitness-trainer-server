import { inject, injectable } from "tsyringe";
import { Request, Response ,NextFunction} from "express";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { IRegisterUseCase } from "application/interfaces/auth/i-register.usecase";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { AppError } from "domain/errors/AppError";
import config from "config";
import { IGetWalletUseCase } from 'application/interfaces/wallet/IGetWalletUseCase';
import { WalletDetailsDTO,WalletTransactionInputDTO } from 'application/dto/wallet/WalletTransactionsDTO';
import { LoginRequestDTO,LoginResponseDTO } from "application/dto/auth/login.dto";
import { RegisterResponseDTO, TrainerRegisterRequestDTO } from "application/dto/auth/register.dto";
import { UpdateProfilePictureRequestDTO } from "application/dto/common/update-profile-picture.dto.";
import { IFetchTrainerDetails } from "application/interfaces/trainer/i-fetch-trainer-details.usecase";
import { TrainerPrivateProfileDTO } from "application/dto/trainer/fetch-trainer-details.dto";
import { IUpdateTrainerProfileUseCase } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import {  UpdateTrainerProfileRequestDTO,ReapplyTrainerRequestDTO, ReapplyTrainerDTO, UpdateTrainerProfileDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { IReapplyTrainer } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { IGetTrainerSlotConfigurationUseCase } from "application/interfaces/slot/i-get-trainer-slot-configuration.usecase";
import { TrainerSlotResponseDTO } from "application/dto/slot/trainer-slot-response.dto";
import { IUpdateTrainerWeeklyAvailabilityUseCase } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase";
import { UpdateTrainerAvailabilityRequestDTO } from "application/dto/slot/update-trainer-availability.dto";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO, FetchAllTrainerPendingBookingsResponseDTO, FetchAllTrainerRescheduleBookingsResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { TrainerBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { IFetchBookingDetailsForTrainer } from "application/interfaces/booking/i-fetch-booking-details.trainer";
import { IConfirmBookingUseCase } from "application/interfaces/booking/i-confirm-booking.usecase";
import { IDeclineBookingUseCase } from "application/interfaces/booking/i-decline-booking-request.usecase";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { ITrainerDashBoard } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { ITrainerDashBoardAppointments } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";
import { TrainerDashboardAppointmentResponseDTO, TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
@injectable()
export class TrainerController {
  constructor(
    @inject("TrainerLoginUseCase") private readonly _trainerLoginUsecase: ILoginUseCase,
    @inject("TrainerRegisterUseCase") private readonly _trainerRegisterUsecase: IRegisterUseCase<TrainerRegisterRequestDTO>,
    @inject("TrainerReapplyUsecase") private readonly _trainerReapplyUsecase: IReapplyTrainer,
    @inject("FetchTrainerProfileUseCase") private _findTrainerDetails: IFetchTrainerDetails<TrainerPrivateProfileDTO>,
    @inject("TrainerProfileUseCase") private _updateTrainerData: IUpdateTrainerProfileUseCase,
    @inject("UpdateTrainerProfilePicture") private readonly _updateTrainerProfilePic: IUpdateProfilePicture,
    @inject("UpdateTrainerWeeklyAvailabilityUseCase") private _updateTrainerWeeklySlotUseCase:IUpdateTrainerWeeklyAvailabilityUseCase,
    @inject("GetTrainerSlotUseCase") private _getTrainerSlotUseCase:IGetTrainerSlotConfigurationUseCase,
    @inject("GetWalletUseCase") private _getTrainerWalletUseCase:IGetWalletUseCase<WalletDetailsDTO>,
    @inject("TrainerAcceptBookingUseCase") private _confirmBookingUseCase:IConfirmBookingUseCase,
    @inject("TrainerRejectBookingUseCase") private _declineBookingUseCase:IDeclineBookingUseCase,
    @inject("ProcessRescheduleUseCase") private _processRescheduleUseCase: IProcessTrainerRescheduleUseCase,
    @inject("FetchTrainerAllBookingUseCase") private _fetchAllBookingsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO,FetchAllTrainerBookingsResponseDTO>,
    @inject("FetchTrainerPendingBookingUseCase") private _fetchPendingBookingsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO,FetchAllTrainerPendingBookingsResponseDTO>,
    @inject("FetchTrainerRescheduleRequests") private _fetchRescheduledRequestBookingsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO,FetchAllTrainerRescheduleBookingsResponseDTO>,
    @inject("FindTrainerBookingDetails") private _findTrainerBookingDetailsUseCase:IFetchBookingDetailsForTrainer,
    @inject("ITrainerDashBoard") private _getTrainerDashboardData:ITrainerDashBoard,
   @inject("ITrainerDashBoardAppointments") private _getTrainerAppointmentDashboardData:ITrainerDashBoardAppointments,
     ){}



RegisterTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, gender, experience, pricePerSession } = req.body;

    const services = Array.isArray(req.body.services) 
      ? req.body.services 
      : req.body["services[]"] ? [].concat(req.body["services[]"]) : [];

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
      experience,
      pricePerSession,
      services,
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


loginTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
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


verifyTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const trainer:TrainerPrivateProfileDTO = await this._findTrainerDetails.execute(id);
   if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.AUTH.AUTHORIZED_SUCCESSFULLY,
      trainer: {
        id: trainer.trainerId,
        email: trainer.email,
        status: trainer.status,   
        verified: trainer.verified  
      }
    });
  } catch (err) {
    next(err);
  }
};
getTrainerDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const trainer:TrainerPrivateProfileDTO = await this._findTrainerDetails.execute(id);

    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).json({ 
      success: true,
      trainer 
    });
  } catch (err) {
    next(err);
  }
};
reApplyTrainer = async (req: Request, res: Response, next: NextFunction) => {
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
      services: parseArray('services'),
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
updateTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };
    if (!id) {
      throw new AppError("Unauthorized access", HttpStatus.UNAUTHORIZED);
    }
    const parseArray = (key: string) => {
      const val = req.body[`${key}[]`] || req.body[key];
      return Array.isArray(val) ? val : val ? [val] : [];
    };
    const { name, gender, experience, bio, phone, address, pricePerSession } = req.body;
    const data: UpdateTrainerProfileDTO = {
      name,
      gender,
      bio,
      phone,
      address,
      experience: Number(experience),
      pricePerSession: Number(pricePerSession),
      languages: parseArray('languages'),
      services: parseArray('services'),
    };
    let input:UpdateTrainerProfileRequestDTO={
      trainerId:id,
      data
    }
    await this._updateTrainerData.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE.PROFILE_DATA_UPDATED,
    });
  } catch (err) {
    next(err);
  }
};

updateProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id?: string })?.id;

    if (!userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!req.file) {
      throw new AppError(ERROR_MESSAGES.PROFILE_PICTURE_MISSING, HttpStatus.BAD_REQUEST);
    }

    const input: UpdateProfilePictureRequestDTO = {
      id: userId,
      profilePic: req.file
    };

    const imageUrl = await this._updateTrainerProfilePic.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE.PROFILE_PICTURE_UPDATED,
      data: { imageUrl }
    });
  } catch (error) {
    next(error);
  }
};

getTrainerSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const result:TrainerSlotResponseDTO = await this._getTrainerSlotUseCase.execute(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.TRAINER.TRAINER_SLOTS_FETCHED,
      data: result
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

updateWeeklySlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };
    const { weeklyAvailability } = req.body;

    if (!id) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    let input:UpdateTrainerAvailabilityRequestDTO={
      trainerId:id,
      availability:weeklyAvailability
    }
    await this._updateTrainerWeeklySlotUseCase.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.TRAINER.TRAINER_WEEKLY_SLOT_UPDATED,
    });
  } catch (err) {
    next(err);
  }
};
fetchTrainerWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };
    const { page, limit, search } = req.query;
    const input:WalletTransactionInputDTO={
      ownerId: id,
      currentPage: Number(page) || 1,
      limit: Number(limit) || 10,
      searchQuery: (search as string) || ""
    }
    const result = await this._getTrainerWalletUseCase.execute(input);
    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.WALLET.WALLET_DETAILS_FETCHED,
      ...result
    });
  } catch (err) {
    next(err);
  }
};


confirmBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: trainerId } = req.user as { id: string };
    const { bookingId } = req.params;

    if (!trainerId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    await this._confirmBookingUseCase.execute(bookingId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.BOOKING.TRAINER_BOOKING_SUCCESSFULL,
    });
  } catch (error) {
    next(error);
  }
};
declineBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const { id: trainerId } = req.user as { id: string };
    const {reason}=req.body
    if (!trainerId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    await this._declineBookingUseCase.execute(bookingId,reason);

    res.status(HttpStatus.OK).json({ 
      success: true, 
      message: SUCCESS_MESSAGES.BOOKING.TRAINER_DECLINED_BOOKING
    });
  } catch (error) {
    next(error);
  }
};


processReschedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, action } = req.body

    if (!bookingId || !action) {
      throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
    }
    let input:ProcessRescheduleRequestDTO={
      bookingId,
      action
    }

    await this._processRescheduleUseCase.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_PROCCESSED(action),
    });
  } catch (error) {
    next(error);
  }
};

getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const { id: trainerId } = req.user as any;
    if (!trainerId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }  
    const input: FetchAllTrainerBookingRequestDTO = {
        trainerId,
        currentPage:Math.max(1, Number(req.query.pageNO) || 1),
        limit: Number(req.query.limit) || 5,
        searchQuery: (req.query.search as string) || "",
        filter:{}
      };
      const result:FetchAllTrainerBookingsResponseDTO = await this._fetchAllBookingsUseCase.execute(input);
      res.status(HttpStatus.OK).json({ 
        success: true,
        message:SUCCESS_MESSAGES.BOOKING.BOOKINGS_FETCHED,
         ...result
         });
    } catch (err) { next(err); }
  };

  getPending = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const { id: trainerId } = req.user as any;
    if (!trainerId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }  
    const input: FetchAllTrainerBookingRequestDTO = {
        trainerId,
        currentPage:Math.max(1, Number(req.query.pageNO) || 1),
        limit: Number(req.query.limit) || 5,
        searchQuery: (req.query.search as string) || "",
        filter:{}
      };
      const result:FetchAllTrainerPendingBookingsResponseDTO = await this._fetchPendingBookingsUseCase.execute(input);
      res.status(200).json({ 
        success: true,
        message:SUCCESS_MESSAGES.BOOKING.BOOKING_PENDING_FETCHED,
        ...result 
      });
    } catch (err) { next(err); }
  };

  getReschedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const { id: trainerId } = req.user as any;
    if (!trainerId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }  
    const input: FetchAllTrainerBookingRequestDTO = {
        trainerId,
        currentPage:Math.max(1, Number(req.query.pageNO) || 1),
        limit: Number(req.query.limit) || 5,
        searchQuery: (req.query.search as string) || "",
        filter:{}
      };
      const result:FetchAllTrainerRescheduleBookingsResponseDTO = await this._fetchRescheduledRequestBookingsUseCase.execute(input);
      res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
  };

  getBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.params;
        if (!bookingId) {
            throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
        }
        const result:TrainerBookingDetailsResponseDTO = await this._findTrainerBookingDetailsUseCase.execute(bookingId);

        res.status(200).json({
            success: true,
            message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

getTrainerDashboardData = async (req: Request, res: Response, next: NextFunction) => {
    const { id: trainerId } = req.user as any;
    if (!trainerId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const result:TrainerDashboardResponseDTO = await this._getTrainerDashboardData.execute(trainerId);

    res.status(HttpStatus.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DASHBOARD.DASHBOARD_DATA_FETCHED,
        result
    });
};

getTrainerDashboardAppointmentData = async (req: Request, res: Response, next: NextFunction) => {
    const { id: trainerId } = req.user as any;
    const { date } = req.query; 

    if (!trainerId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const targetDate = date ? new Date(date as string) : new Date();

    const result:TrainerDashboardAppointmentResponseDTO = await this._getTrainerAppointmentDashboardData.execute(trainerId, targetDate);
    console.log(result)
    res.status(HttpStatus.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DASHBOARD.TRAINER_APPOINTMENT_DATA,
        result
    });
};
}
