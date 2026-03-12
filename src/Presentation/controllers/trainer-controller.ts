import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { FetchAllPendingTrainersResponseDTO, FetchAllTrainersRequestDTO, FetchAllTrainersResponseDTO,FetchAllClientTrainersResponseDTO  } from 'application/dto/trainer/fetch-all-trainers.dto';
import { IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { TrainerDetailsResponseDTO} from 'application/dto/trainer/fetch-trainer-details.dto';
import { IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { UpdateStatusRequestDTO, UpdateStatusResponseDTO } from 'application/dto/common/update-status.dto';
import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { UpdateProfilePictureRequestDTO } from "application/dto/common/update-profile-picture.dto.";
import { TrainerPrivateProfileDTO } from "application/dto/trainer/fetch-trainer-details.dto";
import { IUpdateTrainerProfileUseCase } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import {  UpdateTrainerProfileRequestDTO, UpdateTrainerProfileDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { UserTrainerViewDTO } from 'application/dto/trainer/fetch-trainer-details.dto';
import { TrainerFilter } from 'domain/entities/TrainerEntity';
import { TrainerApprovalRequestDTO,TrainerApprovalResponseDTO } from 'application/dto/trainer/trainer-approval.dto';
import { IHandleTrainerApproval } from 'application/interfaces/trainer/i-handle-trainer-approval.usecase';

@injectable()
export class TrainerController {
  constructor(
    @inject("BlockUnblockTrainerUseCase") private _toggleStatus: IUpdateStatus,
    @inject("FetchTrainerDetailsForAdmin") private _getDetailsForAdmin: IFetchTrainerDetails<TrainerDetailsResponseDTO>,
    @inject("FindAllTrainersUseCase") private _getAllVerified: IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO>,
    @inject("FindAllPendingTrainers") private _getAllPending: IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO>,
    @inject("FetchTrainerProfileUseCase") private _getOwnProfile: IFetchTrainerDetails<TrainerPrivateProfileDTO>,
    @inject("TrainerProfileUseCase") private _updateProfile: IUpdateTrainerProfileUseCase,
    @inject("UpdateTrainerProfilePicture") private _updateAvatar: IUpdateProfilePicture,
    @inject("FindAllClientTrainersUseCase") private _getPublicList: IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO>,
    @inject("FetchTrainerDetailsForClient") private _getPublicDetails: IFetchTrainerDetails<UserTrainerViewDTO>,
    @inject("TrainerVerificationUseCase") private _handleTrainerApprovalUseCase: IHandleTrainerApproval,
  
  ) {}



  getVerifiedTrainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.pageNO) || 1);
      const input: FetchAllTrainersRequestDTO = {
        searchQuery: (req.query.search as string) || "",
        limit: 10,
        currentPage: page,
        filter: {}
      };
      const result = await this._getAllVerified.execute(input);
      res.status(HttpStatus.OK).json({ success: true, ...result });
    } catch (error) { next(error); }
  };

  getPendingTrainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.pageNO) || 1);
      const input: FetchAllTrainersRequestDTO = {
        searchQuery: (req.query.search as string) || "",
        limit: 10,
        currentPage: page,
        filter: {}
      };
      const result = await this._getAllPending.execute(input);
      res.status(HttpStatus.OK).json({ success: true, ...result });
    } catch (error) { next(error); }
  };

  getTrainerDetailsAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this._getDetailsForAdmin.execute(req.params.id);
      res.status(HttpStatus.OK).json({ success: true, trainer: result });
    } catch (error) { next(error); }
  };

  updateAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: UpdateStatusRequestDTO = { id: req.params.id, isActive: req.body.status };
      const result:UpdateStatusResponseDTO = await this._toggleStatus.execute(payload);
      res.status(HttpStatus.OK).json(result);
    } catch (error) { next(error); }
  };



  getOwnProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as { id: string };
      const result = await this._getOwnProfile.execute(id);
      res.status(HttpStatus.OK).json({ success: true, trainer: result });
    } catch (error) { next(error); }
  };

  updateOwnProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as { id: string };
    if (!id) {
      throw new AppError("Unauthorized access", HttpStatus.UNAUTHORIZED);
    }
    console.log(req.body)
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
      programs: parseArray('programs'),
    };
    let input:UpdateTrainerProfileRequestDTO={
      trainerId:id,
      data
    }
    await this._updateProfile.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE.PROFILE_DATA_UPDATED,
    });
  } catch (err) {
    next(err);
  }
  };

  updateOwnAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as { id: string };
      if (!req.file) throw new AppError(ERROR_MESSAGES.PROFILE_PICTURE_MISSING, HttpStatus.BAD_REQUEST);
      const imageUrl = await this._updateAvatar.execute({ id, profilePic: req.file });
      res.status(HttpStatus.OK).json({ success: true, data: { imageUrl } });
    } catch (error) { next(error); }
  };



  getPublicTrainerList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: TrainerFilter = {
        gender: req.query.gender as any,
        programId: req.query.programs as string,
        sort: req.query.sort as any
      };
      const result = await this._getPublicList.execute({
        searchQuery: req.query.search?.toString() || "",
        currentPage: Math.max(1, Number(req.query.pageNO) || 1),
        limit: 5,
        filter: filters
      });
      res.status(HttpStatus.OK).json({ success: true, ...result });
    } catch (error) { next(error); }
  };

  getPublicTrainerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this._getPublicDetails.execute(req.params.id);
      res.status(HttpStatus.OK).json({ success: true, trainer: result });
    } catch (error) { next(error); }
  };

  handleTrainerApproval = async (req: Request, res: Response, next: NextFunction) => {
      try {
          const input: TrainerApprovalRequestDTO = {
              trainerId: req.params.id,
              action: req.body.action,
              reason: req.body.reason
          };
  
          const result:TrainerApprovalResponseDTO = await this._handleTrainerApprovalUseCase.execute(input);
  
          res.status(HttpStatus.OK).json(result);
      } catch (error) {
          next(error);
      }
  };
}