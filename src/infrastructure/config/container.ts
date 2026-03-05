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



import { ISendPasswordResetLinkUseCase } from "application/interfaces/auth/i-send-password-reset-link.usecase";
import { SendPasswordResetLinkUseCase } from "application/usecases/auth/send-password-reset-link.usecase";

import { ResetPasswordUseCase } from "application/usecases/auth/change-password-token.usecase";


import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchUserAllBookings } from "application/usecases/booking/fetch-all-user-bookings.usecase";




import { IUpdateStatus } from "application/interfaces/common/i-update-status.usecase";
import { UpdateTrainerStatusUseCase } from "application/usecases/trainer/update-trainer-status.usecase";
import { UpdateUserStatusUseCase } from "application/usecases/user/update-user-status.uscase";



import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { FetchAllClientTrainersUseCase } from "application/usecases/trainer/fetch-all-client-trainers.usecase";
import { FetchAllTrainersUseCase } from "application/usecases/trainer/fetch-all-trainers.usecase";

import { IFetchTrainerDetails } from "application/interfaces/trainer/i-fetch-trainer-details.usecase";
import { FetchTrainerDetailsForAdmin } from "application/usecases/trainer/fetch-trainer-details.admin.usecase";
import { FetchTrainerDetailsForClient } from "application/usecases/trainer/fetch-trainer-detailes.client.usecase";
import { FetchTrainerProfileUseCase } from "application/usecases/trainer/fetch-trainer-profile.usecase";

import { IHandleTrainerApproval } from "application/interfaces/trainer/i-handle-trainer-approval.usecase";
import { HandleTrainerApproval } from "application/usecases/trainer/handle-trainer-approval.usecase";

import { IFetchAllUsersUseCase } from "application/interfaces/user/i-fetch-all-users.usecase";
import { FetchAllUsersUseCase } from "application/usecases/user/fetch-all-users-usecase";




import { IRegisterUseCase } from "application/interfaces/auth/i-register.usecase";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";

import { AdminLoginUsecase } from "application/usecases/auth/admin-login.usecase";

import { TrainerLoginUseCase } from "application/usecases/auth/trainer-login.usecase";
import { TrainerRegisterUseCase } from "application/usecases/auth/trainer-register.usecase";

import { UserLoginUseCase } from "application/usecases/auth/user-login.usecase";
import { UserRegisterUseCase } from "application/usecases/auth/user-register.usecase";

import { IReapplyTrainer } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { ReapplyTrainerUseCase } from "application/usecases/trainer/trainer-reapply.usecase";

import { CreateServiceUseCase } from "application/usecases/services/create-service.usecase";

import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { ServiceRepoImpl } from "infrastructure/database/repositories/ServiceRepoImpl";


import { ISlotRepo } from "domain/repositories/ISlotRepo";
import { SlotRepoImpl } from "infrastructure/database/repositories/SlotImpl";

import { FetchServiceDetailsUseCase } from "application/usecases/services/fetch-service-details.usecase";


import { IDeleteServiceUseCase } from "application/interfaces/services/i-delete.service.usecase";
import { DeleteServiceUseCase } from "application/usecases/services/delete-service.usecase";

import { IUpdateServiceUseCase } from "application/interfaces/services/i-update-service.usecase";
import { UpdateServiceUseCase } from "application/usecases/services/update-service.usecase";

import { IFetchAllServicesUseCase } from "application/interfaces/services/i-fetch-all-services.usecase";
import { FetchServicesUseCase } from "application/usecases/services/fetch-all-services.usecase";


import { UpdateTrainerProfilePicture } from "application/usecases/trainer/update-trainer-profile-picture.usecase";
import { UpdateUserProfilePicture } from "application/usecases/user/update-user-profile-picture.usecase.";

import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { WalletRepoImpl } from "infrastructure/database/repositories/WalletRepoImpl";

import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { BookingRepoImpl } from "infrastructure/database/repositories/BookingRepoImpl";


import { IChangePasswordUseCase } from "application/interfaces/auth/i-change-password.usecase";
import { ChangeUserPasswordUseCase } from "application/usecases/auth/change-user-password.usecase";

import { FetchAllPendingTrainers } from "application/usecases/trainer/fetch-all-pending-trainers.usecase";

import { IGetTrainerSlotConfigurationUseCase } from "application/interfaces/slot/i-get-trainer-slot-configuration.usecase";
import { GetTrainerSlotConfigurationUseCase } from "application/usecases/slot/get-trainer-slot-configuration.usecase.ts";

import { IUpdateTrainerWeeklyAvailabilityUseCase } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase";
import { UpdateTrainerWeeklyAvailabilityUseCase } from "application/usecases/slot/update-trainer-weekly-availability.usecase";

import { IPaymentService } from "domain/services/IPaymentService";
import { PaymentService } from "infrastructure/services/PaymentService";


import { IInitiateOnlinePayment } from "application/interfaces/payment/i-initiate-online-payment.usecase";
import { InitiateOnlinePaymentUseCase } from "application/usecases/payment/initiate-online-payment.usecase";

import { IConfirmBookingUseCase } from "application/interfaces/booking/i-confirm-booking.usecase";
import { ConfirmBookingUseCase } from "application/usecases/booking/confirm-client-booking-usecase";

import { IDeclineBookingUseCase } from "application/interfaces/booking/i-decline-booking-request.usecase";
import { DeclineBookingUseCase } from "application/usecases/booking/decline-booking-requests.usecase";

import { IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { FetchBookingDetailsForClient } from "application/usecases/booking/fetch-booking-details.user";
import { FetchBookingDetailsForTrainer } from "application/usecases/booking/fetch-booking-details.trainer";


import { IRequestBookingRescheduleUseCase } from "application/interfaces/booking/i-request-booking-reschedule.usecase";
import { RequestBookingRescheduleUseCase } from "application/usecases/booking/reschedule-request-booking.usecase";

import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { ProcessTrainerRescheduleUseCase } from "application/usecases/booking/process-client-reschedule-request.usecase";

import { FetchTrainerAllBookings } from "application/usecases/booking/fetch-all-trainer-booking.usecase";
import { FetchTrainerAllPendingBookings } from "application/usecases/booking/fetch-all-trainer-pending-booking.usecase";
import { FetchTrainerAllRescheduleBookings } from "application/usecases/booking/fetch-all-trainer-reschedule-bookings.usecase";



import { ICancelBooking } from "application/interfaces/booking/i-cancel-booking.usecase";
import { CancelUserBookingUseCase } from "application/usecases/booking/user-booking-cancelation.usecase";

import { IGetWalletUseCase } from "application/interfaces/wallet/IGetWalletUseCase";
import { GetWalletUseCase } from "application/usecases/wallet/get-wallet-usecase";


import { IJwtService } from "domain/services/i-jwt.service";
import { JwtService } from "infrastructure/services/jwt.service";
import { ICreateServiceUseCase } from "application/interfaces/services/i-create.service.usecase";
import { IFetchServiceDetailsUseCase } from "application/interfaces/services/i-fetch-service-details.usecase";

import { IListUnlistServiceUseCase } from "application/interfaces/services/i-list-unlist.service.usecase";
import { ListUnlistServiceUseCase } from "application/usecases/services/list-unlist-service.usecase";

import { IFetchPublicServiceUseCase } from "application/interfaces/public/i-fetch-public-services.usecase";
import { FetchPublicServiceUseCase } from "application/usecases/public/fetch-public-services.usecase";

import { RefreshAccessTokenUseCase } from "application/usecases/public/refresh-access-token.usecase";
import { IRefreshAccessTokenUseCase } from "application/interfaces/public/i-refresh-access-token.usecase";


import { IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { VerifyUserAccountUseCase } from "application/usecases/public/verify-client-otp.usecase";
import { VerifyTrainerAccountUseCase } from "application/usecases/public/verify-trainer-otp.usecase";

import { IReSendOtpUseCase } from "application/interfaces/public/i-resend-otp.usecase";
import { ReSendOtpUseCase } from "application/usecases/public/resend-otp.usecase";

import { IFetchUserDetailsUseCase } from "application/interfaces/user/i-fetch-user-details.usecase";
import { FetchUserDetailsForAdmin } from "application/usecases/user/fetch-user-details.admin.usecase";
import { FetchUserProfileUseCase } from "application/usecases/user/fetch-user-profile.usecase"

import { IUpdateUserProfileUseCase } from "application/interfaces/user/i-update-user-profile.usecase";
import { UpdateUserProfileUseCase } from "application/usecases/user/update-user-profile.usecase";

import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { IUpdateTrainerProfileUseCase } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import { UpdateTrainerProfileUseCase } from "application/usecases/trainer/update-trainer-profile.usecase";

import { IFetchTrainerAvailableSlotsUseCase } from "application/interfaces/slot/i-fetch-trainer-available-slots.usecase";
import { FetchTrainerAvailableSlotsUseCase } from "application/usecases/slot/fetch-trainer-available-slots.usecase";

import { TrainerDashboardAppointmentUsecase } from "application/usecases/dashboard/trainer-dashboard-appointments.usecase";
import { TrainerDashboardUsecase } from "application/usecases/dashboard/trainer-dashboard.usecase";
import { ITrainerDashBoard } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { ITrainerDashBoardAppointments } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";

import { IAdminDashboard } from "application/interfaces/dashboard/i-admin-dashboard.usecase";
import { AdminDashboardUsecase } from "application/usecases/dashboard/admin-dashboard.usecase";
import { IVeirfyOnlinePayment } from "application/interfaces/payment/i-verify-online-payment.usecase";
import { VerifyOnlinePaymentUsecase } from "application/usecases/payment/verify-online-payment.usecase";
import { IBookSessionWithTrainer } from "application/interfaces/booking/i-book-session-with-trainer.usecase";
import { OnlineBookingUseCase } from "application/usecases/booking/online-booking.usecase";
import { IVerifySession } from "application/interfaces/auth/i-verify-session.usecase";
import { VerifySessionUseCase } from "application/usecases/auth/verify-session.usecase";

container.register<IVerifySession>("IVerifySession",{useClass:VerifySessionUseCase})


container.register<IAdminDashboard>("IAdminDashboard",{useClass:AdminDashboardUsecase})

container.register<ITrainerDashBoard>("ITrainerDashBoard",{useClass:TrainerDashboardUsecase})
container.register<ITrainerDashBoardAppointments>("ITrainerDashBoardAppointments",{useClass:TrainerDashboardAppointmentUsecase})


container.register<IUpdateUserProfileUseCase>("IUpdateUserProfileUseCase",{useClass:UpdateUserProfileUseCase})


container.register<IFetchUserDetailsUseCase<any>>("FetchUserDetailsForAdmin",{useClass:FetchUserDetailsForAdmin})
container.register<IFetchUserDetailsUseCase<any>>("FetchUserProfileUseCase",{useClass:FetchUserProfileUseCase})


container.register<IReSendOtpUseCase>("IReSendOtpUseCase",{useClass:ReSendOtpUseCase})
container.register<IVerifyAccountUseCase>("VerifyUserAccountUseCase",{useClass:VerifyUserAccountUseCase})
container.register<IVerifyAccountUseCase>("VerifyTrainerAccountUseCase",{useClass:VerifyTrainerAccountUseCase})


container.register<IFetchPublicServiceUseCase>("IFetchPublicServiceUseCase",{useClass:FetchPublicServiceUseCase})

container.register<IListUnlistServiceUseCase>("IListUnlistServiceUseCase",{useClass:ListUnlistServiceUseCase})
container.register<IJwtService>("JwtServiceImpl",{useClass:JwtService})


container.register<IBookSessionWithTrainer>("IBookSessionWithTrainer",{useClass:OnlineBookingUseCase})


container.register<ICancelBooking>("CancelUserBookingUseCase",{useClass:CancelUserBookingUseCase})

container.register<IFetchBookingDetails<any>>("FindTrainerBookingDetails",{useClass:FetchBookingDetailsForTrainer})


container.register<IFetchAllBookingsUseCase<any,any>>("FetchTrainerAllBookingUseCase",{useClass:FetchTrainerAllBookings})
container.register<IFetchAllBookingsUseCase<any,any>>("FetchTrainerPendingBookingUseCase",{useClass:FetchTrainerAllPendingBookings})
container.register<IFetchAllBookingsUseCase<any,any>>("FetchTrainerRescheduleRequests",{useClass:FetchTrainerAllRescheduleBookings})



container.register<IProcessTrainerRescheduleUseCase>("ProcessRescheduleUseCase", { useClass:ProcessTrainerRescheduleUseCase})


container.register<IRequestBookingRescheduleUseCase>("RequestReschedule", { useClass: RequestBookingRescheduleUseCase})


container.register<IFetchBookingDetails<any>>("FetchBookingDetails", { useClass: FetchBookingDetailsForClient})

container.register<IConfirmBookingUseCase>("TrainerAcceptBookingUseCase", { useClass: ConfirmBookingUseCase})
container.register<IDeclineBookingUseCase>("TrainerRejectBookingUseCase", { useClass: DeclineBookingUseCase})

container.register<IInitiateOnlinePayment>("ICreateOrderUseCase", { useClass: InitiateOnlinePaymentUseCase})
container.register<IPaymentService>("IPaymentService", { useClass: PaymentService})
container.register<IVeirfyOnlinePayment>("IVerifyPaymentUseCase", { useClass: VerifyOnlinePaymentUsecase})



container.register<IFetchTrainerAvailableSlotsUseCase>("FetchAvailableSlotUseCase", { useClass: FetchTrainerAvailableSlotsUseCase})

container.register<IUpdateTrainerWeeklyAvailabilityUseCase>("UpdateTrainerWeeklyAvailabilityUseCase", { useClass: UpdateTrainerWeeklyAvailabilityUseCase})

container.register<IGetTrainerSlotConfigurationUseCase>("GetTrainerSlotUseCase", { useClass: GetTrainerSlotConfigurationUseCase})

container.register<IGetWalletUseCase>("GetWalletUseCase", { useClass: GetWalletUseCase});

container.register<IChangePasswordUseCase<any>>("ChangeUserPasswordUseCase", { useClass: ChangeUserPasswordUseCase});

container.register<IFetchAllBookingsUseCase<any,any>>("FetchUserBookingUseCase", { useClass:FetchUserAllBookings});

container.register<IBookingRepo>("BookingRepo", { useClass:BookingRepoImpl });

container.register<IWalletRepo>("WalletRepo", { useClass:WalletRepoImpl });

container.register<IUpdateProfilePicture>("UpdateTrainerProfilePicture", { useClass: UpdateTrainerProfilePicture });
container.register<IUpdateProfilePicture>("UpdateUserProfilePicture", { useClass: UpdateUserProfilePicture });


container.register<IUpdateServiceUseCase>("UpdateServiceUseCase", { useClass: UpdateServiceUseCase });


container.register<IDeleteServiceUseCase>("DeleteServiceUseCase", { useClass: DeleteServiceUseCase });


container.register<ISlotRepo>("ITrainerSlotRepo", { useClass: SlotRepoImpl });

container.register<ICreateServiceUseCase>("ICreateServiceUseCase", { useClass: CreateServiceUseCase });
container.register<IServiceRepo>("IServiceRepo",{useClass:ServiceRepoImpl});





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

container.register<IReapplyTrainer>("TrainerReapplyUsecase", {
  useClass: ReapplyTrainerUseCase,
});

container.register<IUpdateStatus>("BlockUnblockUserUseCase", {
  useClass: UpdateUserStatusUseCase,
});

container.register<IUpdateStatus>("BlockUnblockTrainerUseCase", {
  useClass: UpdateTrainerStatusUseCase,
});

container.register<IFetchAllUsersUseCase>("FindAllUsersUseCase", {
  useClass: FetchAllUsersUseCase,
});

container.register<IFetchAllServicesUseCase>("FetchServiceUseCase", {
  useClass: FetchServicesUseCase,
});

container.register<IFetchAllTrainersUseCase<any>>("FindAllTrainersUseCase", {
  useClass: FetchAllTrainersUseCase,
});

container.register<IFetchAllTrainersUseCase<any>>("FindAllClientTrainersUseCase", {
  useClass: FetchAllClientTrainersUseCase
});

container.register<IFetchAllTrainersUseCase<any>>("FindAllPendingTrainers", {
  useClass: FetchAllPendingTrainers,
});

container.register<IHandleTrainerApproval>("TrainerVerificationUseCase", {
  useClass: HandleTrainerApproval,
});


container.register<IFetchTrainerDetails<any>>("FetchTrainerDetailsForAdmin", {
  useClass: FetchTrainerDetailsForAdmin,
});

container.register<IFetchTrainerDetails<any>>("FetchTrainerDetailsForClient", {
  useClass: FetchTrainerDetailsForClient,
});


container.register<IFetchTrainerDetails<any>>("FetchTrainerProfileUseCase", {
  useClass: FetchTrainerProfileUseCase,
});

container.register<IFetchServiceDetailsUseCase>("FindServiceByIdUseCase", {
  useClass: FetchServiceDetailsUseCase,
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

container.register<ISendPasswordResetLinkUseCase>("ISendResetMailUseCase", { useClass: SendPasswordResetLinkUseCase })
container.register<IRefreshAccessTokenUseCase>("IRefreshAccessTokenUseCase", { useClass: RefreshAccessTokenUseCase })

container.register<IChangePasswordUseCase<any>>("IResetPasswordUseCase", { useClass: ResetPasswordUseCase });


container.register<IUpdateTrainerProfileUseCase>("TrainerProfileUseCase", { useClass: UpdateTrainerProfileUseCase })

