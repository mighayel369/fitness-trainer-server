
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { IRegisterUseCase } from "application/interfaces/auth/i-register.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IOtpService } from "domain/services/IOtpService";
import { RegisterResponseDTO, TrainerRegisterRequestDTO } from "application/dto/auth/register.dto";
import { STATUS, UserRole } from "utils/Constants";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { randomUUID } from "crypto";

@injectable()
export class TrainerRegisterUseCase implements IRegisterUseCase<TrainerRegisterRequestDTO> {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
    @inject("IPasswordHasher") private readonly _passwordHasher: IPasswordHasher,
    @inject("ICloudinaryService") private readonly _cloudinaryService: ICloudinaryService,
    @inject("IOtpService") private readonly _otpService: IOtpService 
  ) {}

  async execute(input: TrainerRegisterRequestDTO, file?: Express.Multer.File): Promise<RegisterResponseDTO> {
    await this.validateTrainerUniqueness(input.email);

    const hashedPassword = await this._passwordHasher.hash(input.password);
    const certificateUrl = await this.uploadCertificate(file, input.email);

const newTrainer = new TrainerEntity(
  randomUUID(),              
  input.name,                
  input.email,            
  UserRole.TRAINER,           
  STATUS.PENDING,            
  input.pricePerSession, 
  hashedPassword,             
  input.languages,   
  input.experience,    
  input.programs,        
  certificateUrl || null,       
  input.gender,                 
);

   await this._trainerRepo.RegisterTrainer(newTrainer);
    try {
      await this.initializeTrainerAccount(newTrainer.trainerId, newTrainer.email);
      return { email: newTrainer.email };
    } catch (error) {
      console.log(error)
      await this._trainerRepo.deleteTrainer(newTrainer.trainerId);
      throw error instanceof AppError ? error : new AppError(ERROR_MESSAGES.ACCOUNT_SETUP_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async validateTrainerUniqueness(email: string): Promise<void> {
    const existing = await this._trainerRepo.findTrainerByEmail(email);
    if (existing?.status===true && existing?.verified==='accepted') {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
    }
  }

  private async uploadCertificate(file: Express.Multer.File | undefined, email: string): Promise<string | undefined> {
    if (!file) return undefined;
    return await this._cloudinaryService.getTrainerCertificateUrl(file, email);
  }

  private async initializeTrainerAccount(trainerId: string, email: string): Promise<void> {
    const otpSent = await this._otpService.sendOtp(email, UserRole.TRAINER);
    if (!otpSent) {
      throw new AppError(ERROR_MESSAGES.OTP_GENERATE_ERROR, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}