import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { IGetWalletUseCase } from 'application/interfaces/wallet/IGetWalletUseCase';
import { WalletDetailsDTO, WalletTransactionInputDTO } from 'application/dto/wallet/WalletTransactionsDTO';
import { LoginRequestDTO,LoginResponseDTO } from 'application/dto/auth/login.dto';
import { ICreateServiceUseCase } from 'application/interfaces/services/i-create.service.usecase';
import { CreateServiceRequestDTO} from 'application/dto/services/create.service.dto';
import { IFetchAllServicesUseCase } from 'application/interfaces/services/i-fetch-all-services.usecase';
import { FetchServicesRequestDTO,FetchServicesResponseDTO } from 'application/dto/services/fetch-all.service.dto';
import { IUpdateServiceUseCase } from 'application/interfaces/services/i-update-service.usecase';
import { UpdateServiceRequestDTO } from 'application/dto/services/update.service.dto';
import { ServiceDetailsResponseDTO } from 'application/dto/services/service-details.dto';
import { IFetchServiceDetailsUseCase } from 'application/interfaces/services/i-fetch-service-details.usecase';
import { IDeleteServiceUseCase } from 'application/interfaces/services/i-delete.service.usecase';
import { IListUnlistServiceUseCase } from 'application/interfaces/services/i-list-unlist.service.usecase';
import { ListUnlistRequestDTO,ListUnlistResponseDTO } from 'application/dto/services/list-unlist.service.dto';
import { IFetchAllUsersUseCase } from 'application/interfaces/user/i-fetch-all-users.usecase';
import { FetchAllUsersRequestDTO,FetchAllUsersResponseDTO } from 'application/dto/user/fetch-all-users.dto';
import { IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { IFetchUserDetailsUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { AdminUserDetailDTO } from 'application/dto/user/user-details.dto';
import { UpdateStatusRequestDTO, UpdateStatusResponseDTO } from 'application/dto/common/update-status.dto';
import { IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { FetchAllPendingTrainersResponseDTO, FetchAllTrainersRequestDTO, FetchAllTrainersResponseDTO } from 'application/dto/trainer/fetch-all-trainers.dto';
import { IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { TrainerDetailsResponseDTO } from 'application/dto/trainer/fetch-trainer-details.dto';
import { IHandleTrainerApproval } from 'application/interfaces/trainer/i-handle-trainer-approval.usecase';
import { TrainerApprovalRequestDTO,TrainerApprovalResponseDTO } from 'application/dto/trainer/trainer-approval.dto';
import { IAdminDashboard } from 'application/interfaces/dashboard/i-admin-dashboard.usecase';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import config from 'config';
@injectable()
export class AdminController {
  constructor(
    @inject("FindAllTrainersUseCase") private _findAllVerifiedTrainers: IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO>,
    @inject("FindAllUsersUseCase") private _findAllUsersUsecase: IFetchAllUsersUseCase,
    @inject("FetchTrainerDetailsForAdmin") private _findTrainerDetails: IFetchTrainerDetails<TrainerDetailsResponseDTO>,
    @inject("FindServiceByIdUseCase") private _findServiceDetails: IFetchServiceDetailsUseCase,
    @inject("FetchUserDetailsForAdmin") private _findUserDetails: IFetchUserDetailsUseCase<AdminUserDetailDTO>,
    @inject("AdminLoginUsecase") private _adminLoginUseCase: ILoginUseCase,
    @inject("TrainerVerificationUseCase") private _handleTrainerApprovalUseCase: IHandleTrainerApproval,
    @inject("FindAllPendingTrainers") private _findAllPendingTrainers: IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO>,
    @inject("BlockUnblockUserUseCase") private _updateUserStatusUsecase: IUpdateStatus,
    @inject("BlockUnblockTrainerUseCase") private _updateTrainerStatusUsecase: IUpdateStatus,
    @inject('ICreateServiceUseCase') private _createNewService: ICreateServiceUseCase,
    @inject('DeleteServiceUseCase') private _deleteService: IDeleteServiceUseCase,
    @inject("FetchServiceUseCase") private _fetchServices: IFetchAllServicesUseCase,
    @inject("UpdateServiceUseCase") private _updateService: IUpdateServiceUseCase,
    @inject("GetWalletUseCase") private _getAdminWalletUseCase: IGetWalletUseCase<WalletDetailsDTO>,
    @inject("IListUnlistServiceUseCase") private _updateServiceStatusUsecase:IListUnlistServiceUseCase,
     @inject("IAdminDashboard") private _getAdmindashboard:IAdminDashboard,
  ) { }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input:LoginRequestDTO = req.body;

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

  adminFindAllUser = async (req: Request, res: Response, next: NextFunction) => {
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

updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
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

updateTrainerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: UpdateStatusRequestDTO = {
      id: req.params.id,
      isActive: req.body.status
    };
    console.log('hai')
    console.log(payload)

    const result:UpdateStatusResponseDTO = await this._updateTrainerStatusUsecase.execute(payload);

    res.status(HttpStatus.OK).json(result); 
    return
  } catch (error) {
    next(error);
  }
};

  findUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userData:AdminUserDetailDTO = await this._findUserDetails.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message:SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
        user: userData
      });
    } catch (error) {
      next(error);
    }
  };

  adminFindAllTrainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.pageNO) || 1);
      const search = (req.query.search as string) || "";
      let input:FetchAllTrainersRequestDTO={
        searchQuery:search,
        limit:10,
        currentPage:page,
        filter:{}
      }

      const result:FetchAllTrainersResponseDTO = await this._findAllVerifiedTrainers.execute(input);

      res.status(HttpStatus.OK).json({
        success: true,
        message:SUCCESS_MESSAGES.TRAINER.TRAINERS_LISTED,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };



  adminFindAllPendingTrainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.pageNO) || 1);
      const search = (req.query.search as string) || "";
      let input:FetchAllTrainersRequestDTO={
        searchQuery:search,
        limit:10,
        currentPage:page,
        filter:{}
      }

      const result:FetchAllPendingTrainersResponseDTO = await this._findAllPendingTrainers.execute(input);

      res.status(HttpStatus.OK).json({
        success: true,
        message:SUCCESS_MESSAGES.TRAINER.TRAINERS_LISTED,
        ...result
      });
    } catch (error) {
      next(error);
    }
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

  findTrainerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const trainerData:TrainerDetailsResponseDTO = await this._findTrainerDetails.execute(id);

      res.status(HttpStatus.OK).json({
        success: true,
        message:SUCCESS_MESSAGES.TRAINER.TRAINER_DETAILS_FETCHED,
        trainer: trainerData
      });
    } catch (error) {
      next(error);
    }
  };


addNewService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, duration } = req.body;

    const input: CreateServiceRequestDTO = {
      name,
      description,
      duration: Number(duration),
      servicePic: req.file 
    };

    await this._createNewService.execute(input);

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.SERVICE.CREATED,
    });
  } catch (err) {
    next(err);
  }
};


fetchServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: FetchServicesRequestDTO = {
      currentPage: Math.max(1, Number(req.query.pageNO) || 1),
      limit: 5,
      searchQuery: (req.query.search as string) || "",
      filter: {}
    };

    const result: FetchServicesResponseDTO = await this._fetchServices.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.SERVICE.FETCHED,
      ...result 
    });
  } catch (error) {
    next(error);
  }
};

updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, duration } = req.body;

    if (!id) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    const updateDto: UpdateServiceRequestDTO = {
      serviceId: id,
      name,
      description,
      duration: duration ? Number(duration) : undefined,
      file: req.file
    };

    await this._updateService.execute(updateDto);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.SERVICE.UPDATED
    });
  } catch (err) {
    next(err);
  }
};


findServiceDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    const serviceData:ServiceDetailsResponseDTO = await this._findServiceDetails.execute(id);
    
    res.status(HttpStatus.OK).json({
      success: true,
      message:SUCCESS_MESSAGES.SERVICE.DETAILS,
      service: serviceData 
    });
  } catch (error) {
    next(error);
  }
};


  deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
      }
      await this._deleteService.execute(id);

      res.status(HttpStatus.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SERVICE.DELETED,
      });
    } catch (err) {
      next(err);
    }
  };

  fetchAdminWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as { id: string };
      const { limit, search } = req.query;
      const input: WalletTransactionInputDTO = {
        ownerId: id,
        currentPage:Math.max(1, Number(req.query.pageNO) || 1),
        limit: Number(limit) || 10,
        searchQuery: (search as string) || ""
      }
      const result = await this._getAdminWalletUseCase.execute(input);

      res.status(HttpStatus.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.WALLET.WALLET_DETAILS_FETCHED,
        ...result
      });
    } catch (err) {
      next(err);
    }
  };

  updateServiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status) {
      throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
    }
    
      if (!id) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
      }
    let payload:ListUnlistRequestDTO={
      serviceId:id,
      status
    }

    let response:ListUnlistResponseDTO=await this._updateServiceStatusUsecase.execute(payload);
    console.log(response)
    res.status(HttpStatus.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.SERVICE.SERVICE_STATUS_UPDATED(status),
      status:response.status
    });
  } catch (error) {
    next(error);
  }
};

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
}
