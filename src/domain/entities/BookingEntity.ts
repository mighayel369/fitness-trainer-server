import { BOOKING_STATUS } from "utils/Constants";
import { TrainerEntity } from "./TrainerEntity";
import { UserEntity } from "./UserEntity";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ProgramEntity } from "./ProgramEntity";
export class BookingEntity {
  private MAX_RESCHEDULE_LIMIT=2
  constructor(
    public readonly bookingId: string,
    public readonly user: (UserEntity|string),
    public readonly trainer: (TrainerEntity|string),
    public readonly program:string,

    public readonly date: Date,
    public readonly timeSlot: string,
    public readonly duration: number,

    public totalAmount: number,
    public adminCommission: number,
    public trainerEarning: number,

    public readonly status: BOOKING_STATUS,

    public payment: {
      method: "wallet" | "online";
      status: "hold" | "paid" | "refunded";
    },
    public readonly rescheduleRequest?: {
      newDate: Date;
      newTimeSlot: string;
      createdAt: Date;
    },
    public readonly rescheduleCount?:number,
    public rejectReason?:string
  ) {}

  public get trainerId(): string {
    if (typeof this.trainer === 'string') {
      return this.trainer;
    }
    return this.trainer.trainerId;
  }

  public get userId(): string {
  if (typeof this.user === 'string') {
    return this.user;
  }
  return this.user.userId;
}

  public canBeConfirmed(): boolean {
    return this.status === BOOKING_STATUS.PENDING;
  }

  public canBeDeclined(): boolean {
  return this.status === BOOKING_STATUS.PENDING || this.status === BOOKING_STATUS.CONFIRMED;
}

  public canCancel(): boolean {
    const MIN_CANCEL_HOURS = 24;
    const now = new Date();
    const sessionTime = new Date(this.date);
   
    if (this.status !== BOOKING_STATUS.CONFIRMED && this.status !== BOOKING_STATUS.PENDING) return false;
    const hoursDifference = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference >= MIN_CANCEL_HOURS;
}
public requestReschedule(newDate: Date, newTimeSlot: string): void {
  const now = new Date();
  const sessionDate = new Date(this.date);
  
  if (this.status !== BOOKING_STATUS.CONFIRMED) {
    throw new AppError(
      `Cannot reschedule a booking that is currently ${this.status.toLowerCase()}.`, 
      HttpStatus.BAD_REQUEST
    );
  }

  if ((this.rescheduleCount || 0) >= this.MAX_RESCHEDULE_LIMIT) {
    throw new AppError(
      "Maximum reschedule limit (2) has been reached for this booking.", 
      HttpStatus.BAD_REQUEST
    );
  }

  const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilSession < 24) {
    throw new AppError(
      "Rescheduling is only allowed at least 24 hours before the session starts.", 
      HttpStatus.BAD_REQUEST
    );
  }

  (this as any).status = BOOKING_STATUS.RESCHEDULE_REQUESTED;
  (this as any).rescheduleRequest = {
    newDate,
    newTimeSlot,
    createdAt: new Date()
  };
}

public approveReschedule(): void {
  if(!this.rescheduleRequest){
    throw new AppError('Reschedule canot find',HttpStatus.BAD_REQUEST)
  }
    (this as any).date = this.rescheduleRequest.newDate;
    (this as any).timeSlot = this.rescheduleRequest.newTimeSlot;
    (this as any).status = BOOKING_STATUS.CONFIRMED;
    (this as any).rescheduleRequest = undefined;
  }

  public rejectReschedule(reason: string): void {

  (this as any).status = BOOKING_STATUS.CONFIRMED;

  this.rejectReason = reason;

  (this as any).rescheduleRequest = undefined;
}

 
public decline(reason: string): void {
  if (!this.canBeDeclined()) {
    throw new AppError(ERROR_MESSAGES.DECLINE_BOOKING_ERROR, HttpStatus.BAD_REQUEST);
  }

  (this as any).status = BOOKING_STATUS.REJECTED; 
  this.rejectReason = reason;
  this.payment.status = "refunded";
}
}



