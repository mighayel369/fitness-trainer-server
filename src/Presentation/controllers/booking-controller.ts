import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IFetchAllBookingsUseCase } from 'application/interfaces/booking/i-fetch-all-bookings.usecase';
import { FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO } from 'application/dto/booking/fetch-all-bookings.dto';
import { IFetchBookingDetails } from 'application/interfaces/booking/i-fetch-booking-details.usecase';
import { UserBookingDetailsResponseDTO } from 'application/dto/booking/fetch-booking-details.dto';
import { IBookSessionWithTrainer } from 'application/interfaces/booking/i-book-session-with-trainer.usecase';
import { RescheduleRequestDTO } from 'application/dto/booking/reschedule-request.dto';
import { IRequestBookingRescheduleUseCase } from 'application/interfaces/booking/i-request-booking-reschedule.usecase';
import { ICancelBooking } from 'application/interfaces/booking/i-cancel-booking.usecase';
import { FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO, FetchAllTrainerPendingBookingsResponseDTO, FetchAllTrainerRescheduleBookingsResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { TrainerBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { IConfirmBookingUseCase } from "application/interfaces/booking/i-confirm-booking.usecase";
import { IDeclineBookingUseCase } from "application/interfaces/booking/i-decline-booking-request.usecase";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { OnlineBookingRequestDTO } from 'application/dto/booking/book-trainer.dto.';
export class BookingController{
    constructor(
    @inject("FetchBookingDetails") private _getBookingDetailsUseCase:IFetchBookingDetails<UserBookingDetailsResponseDTO>,
    @inject("RequestReschedule") private _requestForRescheduleUseCase: IRequestBookingRescheduleUseCase,
    @inject("CancelUserBookingUseCase") private _cancelUserBookingUseCase:ICancelBooking,
    @inject("IBookSessionWithTrainer") private _finalizeBookingUseCase:IBookSessionWithTrainer,
    @inject("FetchUserBookingUseCase") private _fetchUserBooking:IFetchAllBookingsUseCase<FetchAllUserBookingRequestDTO,FetchAllUserBookingsResponseDTO>,
    @inject("TrainerAcceptBookingUseCase") private _confirmBookingUseCase:IConfirmBookingUseCase,
    @inject("TrainerRejectBookingUseCase") private _declineBookingUseCase:IDeclineBookingUseCase,
    @inject("ProcessRescheduleUseCase") private _processRescheduleUseCase: IProcessTrainerRescheduleUseCase,
    @inject("FetchTrainerAllBookingUseCase") private _fetchAllBookingsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO,FetchAllTrainerBookingsResponseDTO>,
    @inject("FetchTrainerPendingBookingUseCase") private _fetchPendingBookingsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO,FetchAllTrainerPendingBookingsResponseDTO>,
    @inject("FetchTrainerRescheduleRequests") private _fetchRescheduledRequestBookingsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO,FetchAllTrainerRescheduleBookingsResponseDTO>,
    @inject("FindTrainerBookingDetails") private _findTrainerBookingDetailsUseCase:IFetchBookingDetails<TrainerBookingDetailsResponseDTO>
    ){}

    checkoutAndBook = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id: userId } = req.user as { id: string };
        let input:OnlineBookingRequestDTO={
          ...req.body,
          userId
        }
        await this._finalizeBookingUseCase.bookSessionWithTrainer(input);
    
        res.status(HttpStatus.CREATED).json({
          success: true,
          message: SUCCESS_MESSAGES.BOOKING.BOOKING_SUCCESSFULL,
        });
      } catch (error) {
        next(error);
      }
    };

    
    getClientBookingHistory = async (req: Request, res: Response, next: NextFunction) => {
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

    clientSessionDetails = async (req: Request, res: Response, next: NextFunction) => {
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

  requestSessionReschedule = async (req: Request, res: Response, next: NextFunction) => {
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
    
   cancelSession = async (req: Request, res: Response, next: NextFunction) => {
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





    acceptBookingRequest = async (req: Request, res: Response, next: NextFunction) => {
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

   rejectBookingRequest = async (req: Request, res: Response, next: NextFunction) => {
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
    
    
    handleRescheduleRequest = async (req: Request, res: Response, next: NextFunction) => {
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
    
    trainerSessionHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const { id: trainerId } = req.user as { id: string };
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
    
      getPendingSessionRequests = async (req: Request, res: Response, next: NextFunction) => {
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
          res.status(HttpStatus.OK).json({ 
            success: true,
            message:SUCCESS_MESSAGES.BOOKING.BOOKING_PENDING_FETCHED,
            ...result 
          });
        } catch (err) { next(err); }
      };
    
   getRescheduleRequests = async (req: Request, res: Response, next: NextFunction) => {
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
          res.status(HttpStatus.OK).json({ success: true, ...result });
        } catch (err) { next(err); }
      };
    
      trainerSessionDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;
            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }
            const result:TrainerBookingDetailsResponseDTO = await this._findTrainerBookingDetailsUseCase.execute(bookingId);
    
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}