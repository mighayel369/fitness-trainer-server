import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ILoginUseCase } from "domain/usecases/ILoginUseCase";
import { IRegisterUseCase } from "domain/usecases/IRegisterUseCase";
import { ITrainerReapplyUseCase } from "domain/usecases/ITrainerReapplyUsecase";
import { IFindByIdUseCase } from 'domain/usecases/IFindByIdUseCase';
import { ERROR_MESSAGES } from "core/ErrorMessage";
import { HttpStatus } from "core/HttpStatus";
import { CreateParamTrainer } from "domain/entities/TrainerEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { IUpdatableProfile } from 'domain/usecases/IUpdatableProfileUseCase';

import config from "config";
@injectable()
export class TrainerController {
  constructor(
    @inject("TrainerLoginUseCase")
    private readonly _trainerLoginUsecase: ILoginUseCase,

    @inject("TrainerRegisterUseCase")
    private readonly _trainerRegisterUsecase: IRegisterUseCase<CreateParamTrainer>,

    @inject("TrainerReapplyUsecase")
    private readonly _trainerReapplyUsecase: ITrainerReapplyUseCase,

    @inject("FindTrainerByIdUseCase") private _findTrainerDetails: IFindByIdUseCase<TrainerEntity>,
    @inject("TrainerProfileUseCase") private _updateTrainerData: IUpdatableProfile<TrainerEntity>,
  ){}

  createTrainer = async (req: Request, res: Response) => {
    try {
      const { name, email, password, gender, experience } = req.body;
      console.log(req.body)
      const specialization = req.body["specializations[]"] || req.body.specializations;
      const specializations = Array.isArray(specialization) ? specialization : [specialization];
      const language = req.body["languages[]"] || req.body.languages;
      const languages = Array.isArray(language) ? language : [language];
      if (!req.file) {
       res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.CERTIFICATE_MISSING });
       return
      }

      const trainer = await this._trainerRegisterUsecase.execute(
        {
          name,
          email,
          password,
          gender,
          experience,
          specialization: specializations,
          role: "trainer",
          languages
        },
        req.file
      );

      if (!trainer.success) {
       res.status(HttpStatus.BAD_REQUEST).json({ success: trainer.success, message: trainer.message });
       return
      }

      res.status(HttpStatus.OK).json({
        success: trainer.success,
        email: trainer.email,
      });
    } catch (err: any) {
      console.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  };

  loginTrainer = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this._trainerLoginUsecase.execute(email, password);

      if (!result.success) {
        const statusMap: Record<string, number> = {
          [ERROR_MESSAGES.TRAINER_NOT_FOUND]: HttpStatus.NOT_FOUND,
          [ERROR_MESSAGES.PASSWORD_INCORRECT]: HttpStatus.BAD_REQUEST,
          [ERROR_MESSAGES.TRAINER_BLOCKED]: HttpStatus.FORBIDDEN,
          [ERROR_MESSAGES.TRAINER_NOT_VERIFIED]: HttpStatus.FORBIDDEN,
        };

        const status = statusMap[result.message!] || HttpStatus.BAD_REQUEST;
         res.status(status).json({ success: false, message: result.message });
         return
      }

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: config.COOKIE_MAX_AGE,
      });

       res.status(HttpStatus.OK).json({
        success: true,
        accessToken: result.accessToken,
        status:result.verifyStatus
      });
    } catch (error: any) {
      console.error(error);
     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
      return
    }
  };

verifyTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };

    if (!id) {
       res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
      return
    }

    const trainer = await this._findTrainerDetails.find(id);

    if (!trainer) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message:ERROR_MESSAGES.TRAINER_NOT_FOUND
      });
      return 
    }

    res.status(HttpStatus.OK).json({
      success: true,
      trainer: {
        id: trainer._id,
        email: trainer.email,
        status: trainer.status,   
        verified: trainer.verified  
      }
    });
    return
  } catch (err) {
    console.error(err);
     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
    return
  }
};

  getTrainerDetails = async (req: Request, res: Response) => {
    const { id } = req.user as { id: string };
    if (!id) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    return
    }

    const result = await this._findTrainerDetails.find(id);

   res.status(HttpStatus.OK).json({ trainer: result });
   return
  };
reApplyTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string; email?: string; role?: string };

    if (!id) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }

    const { name, experience, gender } = req.body;

    const specialization = req.body["specializations[]"] || req.body.specializations;
    const specializations = Array.isArray(specialization) ? specialization : [specialization];

    const language = req.body["languages[]"] || req.body.languages;
    const languages = Array.isArray(language) ? language : [language];

    const file = req.file;

    const updatedTrainer = await this._trainerReapplyUsecase.execute(id, {
  name,
  experience,
  gender,
  specialization: specializations,
  languages,
}, file);

if (!updatedTrainer.success) {
   res.status(HttpStatus.BAD_REQUEST).json(updatedTrainer);
   return
}

res.status(HttpStatus.OK).json({
  success: true,
  message: "Trainer reapplied successfully. Awaiting verification.",
  trainer: updatedTrainer.trainer,
});
  } catch (error: any) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
updateTrainer = async (req: Request, res: Response) => {
  try {
    const { id, email } = req.user as { id: string; email?: string };

    if (!id) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }
    const result = await this._updateTrainerData.updateData(id, req.body, req.file);

    if (!result.success) {
      res.status(HttpStatus.BAD_REQUEST).json(result);
      return;
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Profile updated successfully",
      trainer: result.data,
    });
  } catch (err) {
    console.error("Error in updateTrainer:", err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}

}
