import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IOnboardNewProgram } from 'application/interfaces/program/i-onboard-new-program';
import { OnboardProgramRequestDTO} from 'application/dto/programs/onboard-new-program.dto';
import { IFetchProgramInventory } from 'application/interfaces/program/i-fetch-program-summary';
import { FetchProgramInventoryRequestDTO,FetchProgramInventoryResponseDTO } from 'application/dto/programs/program-summary.dto';
import { IModifyProgramSpecs } from 'application/interfaces/program/i-modify-program-specs';
import { ModifyProgramSpecsRequestDTO} from 'application/dto/programs/modify-program-sepcs.dto';
import { ProgramDetailsResponseDTO } from 'application/dto/programs/program-details.dto';
import { IFetchProgramDetails } from 'application/interfaces/program/i-program-details';
import { IArchiveProgram } from 'application/interfaces/program/i-archive-program';
import { IToggleProgramVisibility } from 'application/interfaces/program/i-toggle-program-visibility';
import { ToggleProgramVisibilityRequestDTO,ToggleProgramVisibilityResponseDTO} from 'application/dto/programs/toggle-program-visibility.dto';
import { IExplorePrograms } from 'application/interfaces/program/i-explore-programs';
import { ExploreProgramsResponseDTO } from 'application/dto/programs/program-summary.dto';
@injectable()
export class ProgramsController {
  constructor(
    @inject("IToggleProgramVisibility") private _visibilityUseCase: IToggleProgramVisibility,
    @inject('IOnboardNewProgram') private _onboardProgramUseCase: IOnboardNewProgram,
    @inject('IArchiveProgram') private _archiveProgramUseCase: IArchiveProgram,
    @inject("IFetchProgramInventory") private _fetchManagementListUseCase: IFetchProgramInventory,
    @inject("IModifyProgramSpecs") private _modifyProgramUseCase: IModifyProgramSpecs,
    @inject("IFetchProgramDetails") private _findProgramDetailsUseCase: IFetchProgramDetails,
    @inject("IExplorePrograms") private _discoverProgramsUseCase: IExplorePrograms,
  ) {}

  onboardNewProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, duration } = req.body;
      const input: OnboardProgramRequestDTO = {
        name,
        description,
        duration: Number(duration),
        programPic: req.file 
      };

      await this._onboardProgramUseCase.execute(input);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Fitness program onboarded successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  getAdminProgramInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: FetchProgramInventoryRequestDTO = {
        currentPage: Math.max(1, Number(req.query.pageNO) || 1),
        limit: 5,
        searchQuery: (req.query.search as string) || "",
        filter: {}
      };

      const result: FetchProgramInventoryResponseDTO = await this._fetchManagementListUseCase.execute(input);
      console.log(result)
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Program inventory retrieved",
       programs:result 
      });
    } catch (error) {
      next(error);
    }
  };

  modifyProgramSpecifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, duration } = req.body;

      if (!id) throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);

      const updateDto: ModifyProgramSpecsRequestDTO = {
        programId: id,
        name,
        description,
        duration: duration ? Number(duration) : undefined,
        file: req.file
      };

      await this._modifyProgramUseCase.execute(updateDto);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Program specifications updated"
      });
    } catch (err) {
      next(err);
    }
  };

  getProgramFullDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);

      const programData: ProgramDetailsResponseDTO = await this._findProgramDetailsUseCase.execute(id);
      
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Program details retrieved",
        program: programData 
      });
    } catch (error) {
      next(error);
    }
  };

  archiveProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
      
      await this._archiveProgramUseCase.execute(id);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Program has been archived",
      });
    } catch (err) {
      next(err);
    }
  }

  toggleProgramVisibility = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body; 

      if (status === undefined) {
        throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
      }
      
      let payload: ToggleProgramVisibilityRequestDTO= { programId: id, isPublished:status };
      let response: ToggleProgramVisibilityResponseDTO = await this._visibilityUseCase.execute(payload);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Program is now ${status ? 'Published' : 'Hidden'}`,
        status: response.isPublished
      });
    } catch (error) {
      next(error);
    }
  };

  discoverPublicPrograms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: ExploreProgramsResponseDTO = await this._discoverProgramsUseCase.execute();
    console.log(result)
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Active programs discovered",
        program: result
      });
    } catch (err) {
      next(err);
    }
  }
}