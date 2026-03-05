import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { IFetchAllUsersUseCase } from 'application/interfaces/user/i-fetch-all-users.usecase';
import { IFetchUserDetailsUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { FetchAllUsersRequestDTO,FetchAllUsersResponseDTO } from 'application/dto/user/fetch-all-users.dto';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { AdminUserDetailDTO } from 'application/dto/user/user-details.dto';
import { IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { UpdateStatusRequestDTO, UpdateStatusResponseDTO } from 'application/dto/common/update-status.dto';
import { UserProfileDTO } from 'application/dto/user/user-details.dto';
import { UpdateProfilePictureRequestDTO } from 'application/dto/common/update-profile-picture.dto.';
import { UpdateUserProfileDTO, UserProfileUpdateRequestDTO } from 'application/dto/user/update-user-profile.dto';
import { IUpdateProfilePicture } from 'application/interfaces/common/i-update-profile-picture.usecase';
import { IUpdateUserProfileUseCase } from 'application/interfaces/user/i-update-user-profile.usecase';

@injectable()
export class UserController{
    constructor(
    @inject("FetchUserDetailsForAdmin") private _findUserDetailsForAdmin: IFetchUserDetailsUseCase<AdminUserDetailDTO>,
    @inject("FindAllUsersUseCase") private _findAllUsersUsecase: IFetchAllUsersUseCase,
    @inject("BlockUnblockUserUseCase") private _updateUserStatusUsecase: IUpdateStatus,
    @inject("UpdateUserProfilePicture") private readonly _updateUserProfilePic: IUpdateProfilePicture,
    @inject("IUpdateUserProfileUseCase") private _updateUserData: IUpdateUserProfileUseCase,
    @inject("FetchUserProfileUseCase") private _findUserDetailsForUser: IFetchUserDetailsUseCase<UserProfileDTO>,

    ){}

      AdminFindAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const input: FetchAllUsersRequestDTO = {
          currentPage: parseInt(req.query.pageNO as string) || 1,
          limit: 5,
          searchQuery: (req.query.search as string) || "",
          filter: {}
      };

      const result:FetchAllUsersResponseDTO = await this._findAllUsersUsecase.execute(input);

      res.status(HttpStatus.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ADMIN.USER_RETRIEVED,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

    FindUserDetailsForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userData:AdminUserDetailDTO = await this._findUserDetailsForAdmin.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message:SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
        user: userData
      });
    } catch (error) {
      next(error);
    }
  };

  UpdateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: UpdateStatusRequestDTO = {
        id: req.params.id,
        isActive: req.body.status
      };
    
      const result:UpdateStatusResponseDTO = await this._updateUserStatusUsecase.execute(payload);
  
      res.status(HttpStatus.OK).json(result); 
      return
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
  
      const user:UserProfileDTO = await this._findUserDetailsForUser.execute(id);
  
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

}