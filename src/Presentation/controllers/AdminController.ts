import { Request, Response } from 'express';
import { inject, injectable } from "tsyringe";
import { IFindAllUseCase } from 'domain/usecases/IFindAllUseCase';
import { IFindByIdUseCase } from 'domain/usecases/IFindByIdUseCase';
import { IFindAllPendingTrainersUseCase } from 'domain/usecases/IFindAllPendingTrainersUseCase';
import { IPendingTrainersUseCase } from 'domain/usecases/IPendingTrainersUseCase';
import { IVerificationUseCase } from 'domain/usecases/IVerificationUseCase';
import { ILoginUseCase } from 'domain/usecases/ILoginUseCase';
import { IBlockUnblockUseCase } from 'domain/usecases/IBlockUnblockUseCase';
import { ERROR_MESSAGES } from 'core/ErrorMessage';
import { HttpStatus } from 'core/HttpStatus';
import { TrainerEntity } from 'domain/entities/TrainerEntity';
import { UserEntity } from 'domain/entities/UserEntity';
import config from 'config';
@injectable()
export class AdminController {
  constructor(
    @inject("FindAllTrainersUseCase") private _findTrainers: IFindAllUseCase<TrainerEntity>,
     @inject("FindAllUsersUseCase") private _findUsers: IFindAllUseCase<UserEntity>,
      @inject("FindTrainerByIdUseCase") private _findTrainerDetails: IFindByIdUseCase<TrainerEntity>,
    @inject("FindUserByIdUseCase") private _findUserDetails: IFindByIdUseCase<UserEntity>,
    @inject("AdminLoginUsecase") private _adminLoginUseCase: ILoginUseCase,
    @inject("TrainerVerificationUseCase") private _adminHanleVerification: IVerificationUseCase<TrainerEntity>,
    @inject("FindAllPendingTrainers") private _findAllPendingTrainers: IFindAllPendingTrainersUseCase<TrainerEntity>,
   @inject("PendingTrainersDetails") private _findPendingTrainerDetails: IPendingTrainersUseCase<TrainerEntity>,
   @inject("BlockUnblockUserCase") private _blockUnblockUseCase: IBlockUnblockUseCase,

  ) {}

  adminLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this._adminLoginUseCase.execute(email, password);

      if (!result.success) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: result.message });
        return;
      }

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: config.COOKIE_MAX_AGE,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        accessToken: result.accessToken,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  };

  adminFindAllUser = async (req: Request, res: Response) => {
    try {
      const page = req.query.pageNO ? parseInt(req.query.pageNO as string) : 1;
      const search = req.query.search?.toString() || '';
      const { data, totalPages } = await this._findUsers.findAll(page, search);
      res.status(HttpStatus.OK).json({ success: true, users:data, totalPages });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  updateUserData = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const { status } = req.body;
      await this._blockUnblockUseCase.updateStatus(userId, status);
      res.status(HttpStatus.OK).json({ success: true });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  findUserDetails = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const userData = await this._findUserDetails.find(id);
      res.status(HttpStatus.OK).json({ success: true, user: userData });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  adminFindAllTrainers = async (req: Request, res: Response) => {
    try {
      const page = req.query.pageNO ? parseInt(req.query.pageNO as string) : 1;
      const search = req.query.search?.toString() || '';
      const { data, totalPages } = await this._findTrainers.findAll(page, search);
      res.status(HttpStatus.OK).json({ success: true, trainers:data, totalPages });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  getPendingTrainers = async (req: Request, res: Response) => {
    try {
      const pendingTrainers = await this._findAllPendingTrainers.findPendingTrainers()
      res.status(HttpStatus.OK).json({ success: true, trainers: pendingTrainers });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  getSinglePendingTrainer = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const trainerData = await this._findPendingTrainerDetails.findPendingTrainerDetails(id);
      res.status(HttpStatus.OK).json({ success: true, trainer: trainerData });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  handleTrainerVerification = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { action, reason } = req.body;

      const result = await this._adminHanleVerification.handleVerification(id, action, reason);

      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.TRAINER_NOT_FOUND,
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message:
          action === "accept"
            ? ERROR_MESSAGES.TRAINER_VERIFIED
            : `${ERROR_MESSAGES.TRAINER_DECLINED}. Reason: ${reason}`,
      });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  };

  findTrainerDetails = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const trainerData = await this._findTrainerDetails.find(id);
      res.status(HttpStatus.OK).json({ success: true, trainer: trainerData });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };
}
