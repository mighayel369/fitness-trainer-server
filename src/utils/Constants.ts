export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  TRAINER = "trainer"
}

export enum STATUS{
  PENDING="pending",
  ACCEPT="accepted",
  REJECT="rejected"
}



export const APPROVAL_MESSAGES = {
    SUCCESS_SUBJECT: "Account Approved",
    REJECT_SUBJECT: "Application Update",
    SUCCESS_BODY: (name: string) => `Hello ${name}, your professional trainer account has been approved!`,
    REJECT_BODY: (name: string, reason: string) => `Hello ${name}, your application was declined. Reason: ${reason}`,
    LOG_SUCCESS: "Trainer approved successfully",
    LOG_REJECT: "Trainer declined successfully"
};

export enum TRAINER_STATUS_MESSAGES {
    BLOCK_SUCCESS= "Trainer access has been restricted.",
    UNBLOCK_SUCCESS= "Trainer access has been restored.",
    UPDATE_FAILED= "Failed to update trainer status."
};

export enum USER_STATUS_MESSAGES {
    BLOCK_SUCCESS= "Client access has been restricted.",
    UNBLOCK_SUCCESS= "Client access has been restored.",
    UPDATE_FAILED= "Failed to update Client status."
};

export enum BOOKING_STATUS{
    PENDING="pending",
   CONFIRMED="confirmed",
   COMPLETED="completed",
   CANCELED="cancelled",
   RESCHEDULE_REQUESTED="reschedule_requested",
   REJECTED='rejected'
}