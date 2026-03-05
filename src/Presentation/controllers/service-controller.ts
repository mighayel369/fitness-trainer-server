import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
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
import { PublicServiceListResponseDTO } from "application/dto/public/fetch-public.services.dto";
import { IFetchPublicServiceUseCase} from "application/interfaces/public/i-fetch-public-services.usecase";
@injectable()
export class ServiceController{
    constructor(
   @inject("IListUnlistServiceUseCase") private _updateServiceStatusUsecase:IListUnlistServiceUseCase,
    @inject('ICreateServiceUseCase') private _createNewService: ICreateServiceUseCase,
    @inject('DeleteServiceUseCase') private _deleteService: IDeleteServiceUseCase,
    @inject("FetchServiceUseCase") private _fetchServices: IFetchAllServicesUseCase,
    @inject("UpdateServiceUseCase") private _updateService: IUpdateServiceUseCase,
    @inject("FindServiceByIdUseCase") private _findServiceDetails: IFetchServiceDetailsUseCase,
    @inject("IFetchPublicServiceUseCase") private _fetchPublicServices: IFetchPublicServiceUseCase,
    ){}


    createService = async (req: Request, res: Response, next: NextFunction) => {
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


getAllServicesAdmin = async (req: Request, res: Response, next: NextFunction) => {
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

updateServiceDetails = async (req: Request, res: Response, next: NextFunction) => {
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


getServiceDetails = async (req: Request, res: Response, next: NextFunction) => {
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


 removeService = async (req: Request, res: Response, next: NextFunction) => {
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
  }


  toggleServiceStatus = async (req: Request, res: Response, next: NextFunction) => {
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

  getPublicServicesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: PublicServiceListResponseDTO = await this._fetchPublicServices.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message:SUCCESS_MESSAGES.SERVICE.FETCHED,
        data: result.data
      });
    } catch (err) {
      next(err);
    }
  }
}