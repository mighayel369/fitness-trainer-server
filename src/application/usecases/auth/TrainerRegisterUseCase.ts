
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IUserRepo } from "domain/repositories/IUserRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { CreateParamTrainer } from "domain/entities/TrainerEntity";
import { IRegisterUseCase } from "domain/usecases/IRegisterUseCase";

@injectable()
export class TrainerRegisterUseCase implements IRegisterUseCase<CreateParamTrainer> {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
    @inject("IUserRepo") private readonly _userRepo: IUserRepo,
    @inject("IPasswordHasher") private readonly _passwordHasher: IPasswordHasher,
    @inject("ICloudinaryService") private readonly _cloudinaryService: ICloudinaryService
  ) {}

  async execute(payload: CreateParamTrainer, file?: Express.Multer.File) {
    const userExist = await this._userRepo.findUserByEmail(payload.email);
    if (userExist) return { success: false, message: "Email Already Exists" };

    payload.password = await this._passwordHasher.hash(payload.password);

    if (file) {
      payload.certificate = await this._cloudinaryService.getTrainerCertificateUrl(file, payload.email);
    }
    payload.verified='pending'

    const trainer = await this._trainerRepo.createTrainer(payload);
    return { success: true, email: trainer?.email };
  }
}
