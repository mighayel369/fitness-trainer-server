import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IAdminDashboard } from 'application/interfaces/dashboard/i-admin-dashboard.usecase';
import { TrainerDashboardAppointmentResponseDTO, TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { ITrainerDashBoard } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { ITrainerDashBoardAppointments } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";
export class DashboardController{
    constructor(
     @inject("IAdminDashboard") private _getAdmindashboard:IAdminDashboard,
    @inject("ITrainerDashBoard") private _getTrainerDashboardData:ITrainerDashBoard,
   @inject("ITrainerDashBoardAppointments") private _getTrainerAppointmentDashboardData:ITrainerDashBoardAppointments,
    ){}

 fetchAdminDashboardData=async(req:Request,res:Response,next:NextFunction)=>{
    try{
      let data =await this._getAdmindashboard.execute()
      console.log(data)
      res.status(HttpStatus.OK).json({
        success:true,
        message:SUCCESS_MESSAGES.DASHBOARD.DASHBOARD_DATA_FETCHED,
        data
      })
    }catch(err){
      next(err)
    }
  }

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