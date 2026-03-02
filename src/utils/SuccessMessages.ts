export const SUCCESS_MESSAGES = {
  ADMIN: {
    LOGIN: "Admin login successful",
    USER_RETRIEVED: "Users retrieved successfully",
    USER_DETAILS: "User details retrieved successfully",
    TRAINERS_RETRIEVED: "Trainers retrieved successfully",
    TRAINER_DETAILS: "Trainer details retrieved successfully",
    WALLET_RETRIEVED: "Wallet and transactions retrieved successfully",
    DASHBOARD_FETCHED: "Dashboard data fetched successfully",
  },
  SERVICE: {
    CREATED: "Service created successfully",
    FETCHED: "Services fetched successfully",
    UPDATED: "Service updated successfully",
    DELETED: "Service deleted successfully",
    DETAILS: "Service details retrieved successfully",
    LISTED: "Service listed successfully",
    UNLISTED: "Service unlisted successfully",
    SERVICE_STATUS_UPDATED:(status:boolean)=>`Service ${status ? "Listed" : "Unlisted"} Successfully`
  },
  USER:{
     USER_REGISTERED:"User registered successfully",
     RESET_LINK_SENTED: "Sent an reset link in your email" ,
     PASSWORD_UPDATED:"Password updated successfully! Please log in.",
     USER_DETAILS_FETCHED:'User Details Fetched Successfully',
  },
  TRAINER:{
    TRAINERS_LISTED:'All Trainers Listed Successfully',
    TRAINER_DETAILS_FETCHED:'Trainer Details Fetched Successfully' ,
    TRAINER_SLOTS_FETCHED:'All Available Trainer Slots Are Fetched Successfully',
    REAPPLY_SUCCESSFULL:"Reapplied Successfully. Awaiting Verification.",
    TRAINER_WEEKLY_SLOT_UPDATED:"Weekly availability updated successfully" 
  },
  AUTH:{
     LOGOUT_SUCCESS:"Logot Successfull",
     PASSWORD_UPDATED:"Password updated successfully",
     TRAINER_REGISTERATION_SUCCESSFULL:"Trainer registration initiated. Pending admin approval.",
     LOGIN_SUCCESSFULL:'Logged Successfully!',
     AUTHORIZED_SUCCESSFULLY:"Authorized successfully!",
     OTP_SENDED:"A New OTP has been sent to your email." 
  },
  PROFILE:{
    PROFILE_PICTURE_UPDATED:"Profile photo updated successfully",
     PROFILE_DATA_UPDATED:"Your Profile Updated Successfully",
  },
  WALLET:{
    WALLET_DETAILS_FETCHED:"Wallet and transactions retrieved"
  },
  BOOKING:{
    USER_BOOKINGS:'All Available User Bookings Fetched Successfully',
    BOOKING_CANCELLED:"Booking cancelled and refund processed",
    RESCHEDULE_REQUEST_INITIATED: "Reschedule request submitted to trainer successfully.",
    BOOKING_DETAILS_FETCHED:'Booking Details Fetched Successfully',
     BOOKING_SUCCESSFULL:"Payment verified and booking created successfully",
     TRAINER_BOOKING_SUCCESSFULL:"Booking confirmed and funds released to wallet balance.",
     TRAINER_DECLINED_BOOKING:"Booking declined and payment refunded to client wallet.",
     RESCHEDULE_PROCCESSED:(action:string)=>`Reschedule request has been ${action === 'approve' ? 'accepted' : 'rejected'}.`,
     BOOKINGS_FETCHED:'All Bookings Fetched Successfully',
     BOOKING_PENDING_FETCHED:'Fetched All Pending Booking Requests',
  },
  PAYMENT:{
    PAYMENT_REQUEST_INITIATED:'Payment Got Initiated Successfully'
  },
  DASHBOARD:{
     DASHBOARD_DATA_FETCHED:"Dashboard Data Fetched Fuccessfully",
     TRAINER_APPOINTMENT_DATA:"Appointments Fetched Successfully"
  }
};