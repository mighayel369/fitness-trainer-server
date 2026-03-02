export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  SOMETHING_WENT_WRONG: "Something went wrong",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  BAD_REQUEST: "Bad Request",
  NOT_FOUND: "Not Found",
  LOGIN_FAILED: "Login failed",
  EMAIL_EXISTS:"Email Already Exists",
  EMAIL_ALREADY_EXIST:"Email already registered as a user",

  INVALID_CREDENTIALS: "Invalid email or password",
  PASSWORD_INCORRECT: "Password is incorrect",
  ACCOUNT_BLOCKED: "Your account has been blocked",
  ACCOUNT_NOT_VERIFIED: "Your account is not verified",
  IMAGE_FILE_MISSING:"No image file provided",

  USER_FAILED: "User account creation failed",
  USER_VERIFIED:"User Verified",
  USER_NOT_FOUND: "User Not Found",
  USER_BLOCKED: "User account has been blocked",
  OTP_INVALID: "Invalid or expired OTP",
  OTP_GENERATE_ERROR:"Failed to send OTP. Please try again.",
  RESET_LINK_SENT: "Password reset link sent successfully",
  INVALID_RESET_TOKEN: "Invalid or expired reset token",
  PASSWORD_RESET_SUCCESS: "Password has been reset successfully",
  TRAINER_VERIFIED:"Trainer Verified Successfully",
   TRAINER_FAILED: "Trainer account creation failed",
   TRAINER_NOT_VERIFIED:"Trainer Is Not Verified",
  TRAINER_DECLINED: "Trainer declined and deleted successfully",
  TRAINER_NOT_FOUND: "Trainer Not Found",
  TRAINER_BLOCKED: "Trainer Is Blocked",
  CERTIFICATE_MISSING:"Trainer certificate is required.",
  MISSING_REQUIRED_SLOTS_DATA:"Trainer Details and Date are required",
  MISSING_REQUIRED_DATA:'Missing Required Data.Kindly Check Once More And Try Again !',

  REFRESH_TOKEN_MISSING: "No refresh token provided",
  REFRESH_TOKEN_INVALID: "Invalid refresh token",
  ACCESS_TOKEN_GENERATING_FAILURE:"Access Token Generation error Occured",
  OTP_FAILED:"Creating Otp Failed",

  SERVICE_NOT_FOUND:"The service is not found",
  ACCOUNT_SETUP_FAILED:"Account setup failed",
  
  PASSWORD_MISSING:"Password is missing",
  CURRENT_PASSWORD_INCORRECT:"Current password is incorrect",

  INVALID_RESET_LINK:"The reset link is invalid or has expired.",
  PROFILE_PICTURE_MISSING:"Profile picture file is missing",
  PROFILE_PICTURE_UPDATION_FAILED:"Profile picture updation got failed! try again.",


  UPDATE_STATUS_FAILED:"Updating the status failed! try again",

  BOOKING_NOT_FOUND:"Booking not found",
 BOOKING_CONFIRMATION_FAILED: (status: string) => `Cannot confirm booking with status: ${status}`,
 BOOKING_DECLINE_FAILED: (status: string) =>`Cannot decline booking with status: ${status}`,
 RESCHEDULE_FAILED:(status:string)=> `Reschedule not allowed for booking with status: ${status}`,



 PAYMENT_VERIFICATION_FAILED:"Payment security verification failed",

 SLOT_ALREADY_BOOKED:"This slot was just booked by another user.",


 ORDER_CREATION_FAILED:'Order creation failed',
 INVALID_ACTION:(action:string)=>`Action ${action} is invalid`,

 CANCELLATION_TIME_OVER:"Cancellation period expired. Sessions must be cancelled 24h in advance.",
 DECLINE_BOOKING_ERROR:"Booking cannot be declined in its current state",
PENDING_REQUEST_NOT_FOUND:"No pending request found"
}
