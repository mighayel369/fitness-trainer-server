import { BOOKING_STATUS } from "utils/Constants";
import { TrainerEntity } from "./TrainerEntity";
import { UserEntity } from "./UserEntity";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
export class BookingEntity {
  constructor(
    public readonly bookingId: string,
    public readonly user: UserEntity,
    public readonly trainer: TrainerEntity,
    public readonly service: string,

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

public canReschedule(): boolean {
  return this.status === BOOKING_STATUS.CONFIRMED;
}

public approveReschedule(): void {
    if (!this.rescheduleRequest) {
      throw new AppError(ERROR_MESSAGES.PENDING_REQUEST_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    

    (this as any).date = this.rescheduleRequest.newDate;
    (this as any).timeSlot = this.rescheduleRequest.newTimeSlot;
    (this as any).status = BOOKING_STATUS.CONFIRMED;
    (this as any).rescheduleCount = (this.rescheduleCount || 0) + 1;
    (this as any).rescheduleRequest = undefined;
  }

  public rejectReschedule(): void {
    (this as any).status = BOOKING_STATUS.CONFIRMED;
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



