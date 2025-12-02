import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITrainerSlot extends Document {
  trainerId: mongoose.Types.ObjectId;     
  date: string;                          
  startTime: string;                 
  endTime: string;                       
  status: "leave" | "booked";           
  bookedBy?: mongoose.Types.ObjectId;     
  createdAt: Date;
  updatedAt: Date;
}

const TrainerSlotSchema = new Schema<ITrainerSlot>(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    date: { type: String, required: true }, 
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true }, 
    status: { type: String, enum: ["leave", "booked"], required: true },
    bookedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const TrainerSlot: Model<ITrainerSlot> =mongoose.models.TrainerSlot || mongoose.model<ITrainerSlot>("TrainerSlot", TrainerSlotSchema);
