
import { inject, injectable } from "tsyringe";
import { IAdminRepo } from "domain/repositories/IAdminRepo";
import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { JwtService } from "infrastructure/services/JwtService";
import { ILoginUseCase } from "domain/usecases/ILoginUseCase";

@injectable()
export class AdminLoginUsecase implements ILoginUseCase {
  constructor(
    @inject("IAdminRepo") private _AdminRepo: IAdminRepo,
    @inject("IPasswordHasher") private _passwordHasher: IPasswordHasher
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    message?: string;
  }> {
    console.log('in admin usecse')
    const admin = await this._AdminRepo.findAdminByEmail(email);

    if (!admin) {
      return { success: false, message: "Admin not found" };
    }

    if (!admin.password) {
      return { success: false, message: "Password not set for admin" };
    }

    const isMatch = await this._passwordHasher.compare(password, admin.password);

    if (!isMatch) {
      return { success: false, message: "Incorrect password" };
    }

    const accessToken = JwtService.generateAccessToken({
      id: admin._id,
      email: admin.email,
      role: "admin",
    });

    const refreshToken = JwtService.generateRefreshToken({
      id: admin._id,
      email: admin.email,
      role: "admin",
    });

    return { success: true, accessToken, refreshToken };
  }
}
