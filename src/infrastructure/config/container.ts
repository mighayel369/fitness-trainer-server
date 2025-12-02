import { container } from "tsyringe";


import { IDBDatasource } from "domain/repositories/IDBDatasource";
import { IDBDatasourceImpl } from "infrastructure/database/repositories/DBDatasourceImpl";

import { IUserRepo } from "domain/repositories/IUserRepo";
import { UserRepoImpl } from "infrastructure/database/repositories/UserRepoImpl"

import { IPasswordHasher } from "domain/services/IPasswordHasher";
import { PasswordHasherImpl } from "infrastructure/services/PasswordHasherService";

import { IOtpService } from "domain/services/IOtpService";
import { OtpService } from "infrastructure/services/OtpService";

import { IGoogleAuthService } from "domain/services/IGoogleAuthService";
import { GoogleAuthServiceImpl } from "infrastructure/services/GoogleAuthService";

import { IPasswordResetService } from "domain/services/IPasswordResetService";
import { PasswordResetServiceImpl } from "infrastructure/services/PasswordResetService";

import { IAdminRepo } from "domain/repositories/IAdminRepo";
import { AdminRepoImpl } from "infrastructure/database/repositories/AdminRepoImpl";

import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { TrainerRepoImpl } from "infrastructure/database/repositories/TrainerRepoImpl";

import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { CloudinaryService } from "infrastructure/services/CloudinaryService";





import { ISendOtpUseCase } from "domain/usecases/ISendOtpUseCase";
import { SendOtpUseCase } from "application/usecases/auth/SendOtpUseCase";

import { IRefreshAccessTokenUseCase } from "domain/usecases/IRefreshAccessTokenUseCase";
import { RefreshAccessTokenUseCase } from "application/usecases/auth/RefreshAccessTokenUseCase";

import { IResetPasswordUseCase } from "domain/usecases/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "application/usecases/user/ResetPasswordUseCase";

import { ISendResetMailUseCase } from "domain/usecases/ISendResetMailUseCase";
import { SendResetMailUseCase } from "application/usecases/user/SendResetMailUseCase";

import { IVerifyOtpUseCase } from "domain/usecases/IVerifyOtpUseCase";
import { VerifyOtpUseCase } from "application/usecases/auth/VerifyOtpUseCase";







import { IBlockUnblockUseCase } from "domain/usecases/IBlockUnblockUseCase";
import { BlockUnblockUserCase } from "application/usecases/user/BlockUnblockUseCase";

import { IFindAllUseCase } from "domain/usecases/IFindAllUseCase";
import { FindAllTrainersUseCase } from "application/usecases/trainer/FindAllTrainersUseCase";
import { FindAllUsersUseCase } from "application/usecases/user/FindAllUsersUseCase";

import { IFindAllPendingTrainersUseCase } from "domain/usecases/IFindAllPendingTrainersUseCase";

import { IVerificationUseCase } from "domain/usecases/IVerificationUseCase";
import { TrainerVerificationUseCase } from "application/usecases/trainer/TrainerVerificationUseCase";

import { IFindByIdUseCase } from "domain/usecases/IFindByIdUseCase";
import { FindUserByIdUseCase } from "application/usecases/user/FindUserByIdUseCase";
import { FindTrainerByIdUseCase } from "application/usecases/trainer/FindTrainerByIdUseCase";

import { IPendingTrainersUseCase } from "domain/usecases/IPendingTrainersUseCase";

import { IUpdatableProfile } from "domain/usecases/IUpdatableProfileUseCase";
import { TrainerProfileUseCase } from "application/usecases/trainer/TrainerProfileUseCase";

import { IRegisterUseCase } from "domain/usecases/IRegisterUseCase";
import { ILoginUseCase } from "domain/usecases/ILoginUseCase";

import { AdminLoginUsecase } from "application/usecases/auth/AdminLoginUsecase";

import { TrainerLoginUseCase } from "application/usecases/auth/TrainerLoginUseCase";
import { TrainerRegisterUseCase } from "application/usecases/auth/TrainerRegisterUseCase";

import { UserLoginUseCase } from "application/usecases/auth/UserLoginUseCase";
import { UserRegisterUseCase } from "application/usecases/auth/UserRegisterUseCase.";

import { ITrainerReapplyUseCase } from "domain/usecases/ITrainerReapplyUseCase";
import { TrainerReapplyUseCase } from "application/usecases/trainer/TrainerReapplyUseCase";




import { UserProfileUseCase } from "application/usecases/user/UserProfileUseCase";

import { ICreateServiceUseCase } from "domain/usecases/ICreateServiceUseCase";
import { CreateServiceUseCase } from "application/usecases/services/CreateServiceUseCase";

import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { ServiceRepoImpl } from "infrastructure/database/repositories/ServiceRepoImpl";

import { IFindTrainerSlotUseCase } from "domain/usecases/IFIndTrainerSlotUseCase";
import { FindTrainerSlotUseCase } from "application/usecases/slot/FindTrainerSlotUseCase";

import { ITrainerSlotRepo } from "domain/repositories/ITrainerSlotRepo";
import { TrainerSlotRepoImpl } from "infrastructure/database/repositories/TrainerSotRepoImpl";

import { FindServiceByIdUseCase } from "application/usecases/services/FindServiceByIdUseCase";

import { IFindByIdUAndDeleteUseCase } from "domain/usecases/IFindByIdAndDeleteUseCase";
import { DeleteServiceUseCase } from "application/usecases/services/DeleteServiceUseCase";

import { UpdateServiceUseCase } from "application/usecases/services/UpdateServiceUseCase";

import { FetchServicesUseCase } from "application/usecases/services/FetchSercviceUseCase";


import { IUpdateProfilePicture } from "domain/usecases/IUpdateProfilePicture";
import { UpdateTrainerProfilePicture } from "application/usecases/trainer/UpdateTrainerProfilePicture";
import { UpdateUserProfilePicture } from "application/usecases/user/UpdateUserProfilePicture";
container.register<IUpdateProfilePicture>("UpdateTrainerProfilePicture", { useClass: UpdateTrainerProfilePicture });
container.register<IUpdateProfilePicture>("UpdateUserProfilePicture", { useClass: UpdateUserProfilePicture });


container.register<IUpdatableProfile<any>>("UpdateServiceUseCase", { useClass: UpdateServiceUseCase });


container.register<IFindByIdUAndDeleteUseCase>("DeleteServiceUseCase", { useClass: DeleteServiceUseCase });

container.register<IFindTrainerSlotUseCase>("IFindTrainerSlotUseCase", { useClass: FindTrainerSlotUseCase });
container.register<ITrainerSlotRepo>("ITrainerSlotRepo", { useClass: TrainerSlotRepoImpl });

container.register<ICreateServiceUseCase<any>>("ICreateServiceUseCase", { useClass: CreateServiceUseCase });
container.register<IServiceRepo>("IServiceRepo", { useClass: ServiceRepoImpl });

container.register<ILoginUseCase>("AdminLoginUsecase", {
  useClass: AdminLoginUsecase,
});

container.register<ILoginUseCase>("TrainerLoginUseCase", {
  useClass: TrainerLoginUseCase,
});

container.register<ILoginUseCase>("UserLoginUseCase", {
  useClass: UserLoginUseCase,
});

container.register<IRegisterUseCase<any>>("TrainerRegisterUseCase", {
  useClass: TrainerRegisterUseCase,
});

container.register<IRegisterUseCase<any>>("UserRegisterUseCase", {
  useClass: UserRegisterUseCase,
});

container.register<ITrainerReapplyUseCase>("TrainerReapplyUsecase", {
  useClass: TrainerReapplyUseCase,
});

container.register<IBlockUnblockUseCase>("BlockUnblockUserCase", {
  useClass: BlockUnblockUserCase,
});

container.register<IFindAllUseCase<any>>("FindAllUsersUseCase", {
  useClass: FindAllUsersUseCase,
});

container.register<IFindAllUseCase<any>>("FetchServiceUseCase", {
  useClass: FetchServicesUseCase,
});

container.register<IFindAllUseCase<any>>("FindAllTrainersUseCase", {
  useClass: FindAllTrainersUseCase,
});

container.register<IFindAllPendingTrainersUseCase<any>>("FindAllPendingTrainers", {
  useClass: FindAllTrainersUseCase,
});

container.register<IVerificationUseCase<any>>("TrainerVerificationUseCase", {
  useClass: TrainerVerificationUseCase,
});

container.register<IFindByIdUseCase<any>>("FindUserByIdUseCase", {
  useClass: FindUserByIdUseCase,
});

container.register<IFindByIdUseCase<any>>("FindTrainerByIdUseCase", {
  useClass: FindTrainerByIdUseCase,
});

container.register<IFindByIdUseCase<any>>("FindServiceByIdUseCase", {
  useClass: FindServiceByIdUseCase,
});

container.register<IPendingTrainersUseCase<any>>("PendingTrainersDetails", {
  useClass: FindTrainerByIdUseCase,
});




container.register<IDBDatasource>("IDBDatasource", { useClass: IDBDatasourceImpl });
container.register<IUserRepo>("IUserRepo", { useClass: UserRepoImpl });
container.register<IPasswordHasher>("IPasswordHasher", { useClass: PasswordHasherImpl });
container.register<IOtpService>("IOtpService", { useClass: OtpService });
container.register<IGoogleAuthService>("IGoogleAuthService", { useClass: GoogleAuthServiceImpl });
container.register<IPasswordResetService>("IPasswordResetService", { useClass: PasswordResetServiceImpl });
container.register<IAdminRepo>("IAdminRepo", { useClass: AdminRepoImpl });
container.register<ITrainerRepo>("ITrainerRepo", { useClass: TrainerRepoImpl });
container.register<ICloudinaryService>("ICloudinaryService", { useClass: CloudinaryService });

container.register<ISendOtpUseCase>("ISendOtpUseCase", { useClass: SendOtpUseCase })
container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", { useClass: VerifyOtpUseCase })
container.register<ISendResetMailUseCase>("ISendResetMailUseCase", { useClass: SendResetMailUseCase })
container.register<IRefreshAccessTokenUseCase>("IRefreshAccessTokenUseCase", { useClass: RefreshAccessTokenUseCase })

container.register<IResetPasswordUseCase>("IResetPasswordUseCase", { useClass: ResetPasswordUseCase });


container.register<IUpdatableProfile<any>>("TrainerProfileUseCase", { useClass: TrainerProfileUseCase })

container.register<IUpdatableProfile<any>>("UserProfileUseCase", { useClass: UserProfileUseCase });
