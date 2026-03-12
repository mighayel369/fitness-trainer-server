import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IGetTrainerSlotConfigurationUseCase } from "application/interfaces/slot/i-get-trainer-slot-configuration.usecase";
import { TrainerSlotResponseDTO } from "application/dto/slot/trainer-slot-response.dto";
import { IUpdateTrainerWeeklyAvailabilityUseCase } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase";
import { UpdateTrainerAvailabilityRequestDTO } from "application/dto/slot/update-trainer-availability.dto";
import { IFetchTrainerAvailableSlotsUseCase } from 'application/interfaces/slot/i-fetch-trainer-available-slots.usecase';
import { FetchAvailableSlotsRequestDTO } from 'application/dto/slot/fetch-trainer-available-slots.dto';
@injectable()
export class SlotController {
  constructor(
    @inject("UpdateTrainerWeeklyAvailabilityUseCase") private _updateTrainerWeeklySlotUseCase:IUpdateTrainerWeeklyAvailabilityUseCase,
    @inject("GetTrainerSlotUseCase") private _getTrainerSlotUseCase:IGetTrainerSlotConfigurationUseCase,
    @inject("FetchAvailableSlotUseCase") private _generateTrainerSlot:IFetchTrainerAvailableSlotsUseCase,

  ) {}

  getTrainerSchedule = async (req: Request, res: Response, next: NextFunction) => {
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

  syncWeeklyAvailability = async (req: Request, res: Response, next: NextFunction) => {
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


  fetchAvailableSlotsForBooking = async (req: Request, res: Response, next: NextFunction) => {
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
}