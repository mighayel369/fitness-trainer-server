
import { inject, injectable } from "tsyringe";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { JwtService } from "infrastructure/services/JwtService";
import { ILoginUseCase } from "domain/usecases/ILoginUseCase";

@injectable()
export class TrainerLoginUseCase implements ILoginUseCase {
  constructor(
    @inject("ITrainerRepo") private readonly _trainerRepo: ITrainerRepo,
    @inject("IPasswordHasher") private readonly _passwordHasher: IPasswordHasher
  ) {}

  async execute(email: string, password: string) {
    const trainer = await this._trainerRepo.findTrainerByEmail(email);
    if (!trainer) return { success: false, message: "Trainer Not Found" };
    if (trainer.status === false) return { success: false, message: "Trainer Blocked" };

    const isMatch = await this._passwordHasher.compare(password, trainer.password ?? "");
    if (!isMatch) return { success: false, message: "Incorrect Password" };

    const accessToken = JwtService.generateAccessToken({ id: trainer._id, email: trainer.email, role: "trainer" });
    const refreshToken = JwtService.generateRefreshToken({ id: trainer._id, email: trainer.email, role: "trainer" });

    return { success: true, accessToken, refreshToken, verifyStatus: trainer.verified };
  }
}
