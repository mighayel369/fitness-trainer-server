import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  bookingId:string
  user: string;
  trainer: string;
  service: string;

  date: Date;
  timeSlot: string;
  duration: number;

  totalAmount: number;
  adminCommission: number;
  trainerEarning: number;

  status: "pending" | "confirmed" | "completed" | "cancelled" | "reschedule_requested";

  payment: {
    method: "wallet" | "online";
    status: "hold" | "paid" | "refunded";
  };

  rescheduleRequest?: {
    newDate: Date;
    newTimeSlot: string;
    requestedBy: "user" | "trainer";
    reason?: string;
  };
  rescheduleCount?:number
  sessionRating?:number,
  rejectReason?:string
}

const BookingSchema = new Schema<IBooking>({
   bookingId: { type: String, required: true, trim: true,unique: true },
  user: { type: String, ref: "User", required: true },
  trainer: { type: String, ref: "Trainer", required: true },
  service: { type: String, required: true },

  date: Date,
  timeSlot: String,
  duration: Number,

  totalAmount: Number,
  adminCommission: Number,
  trainerEarning: Number,

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled","reschedule_requested","rejected"],
    default: "pending"
  },

  payment: {
    method: String,
    status: String
  },
  rescheduleRequest: {
    newDate: Date,
    newTimeSlot: String,
  },
  rescheduleCount:Number,
  sessionRating:Number,
  rejectReason:String
}, { timestamps: true});

export default mongoose.model<IBooking>("Booking", BookingSchema);
