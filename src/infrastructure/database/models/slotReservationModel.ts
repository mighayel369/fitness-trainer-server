import mongoose, { Schema, Document } from "mongoose";

const SlotReservationSchema = new Schema({
  trainerId: Schema.Types.ObjectId,
  date: Date,
  timeSlot: String,
  bookingId: Schema.Types.ObjectId,
  status: { type: String, enum: ["hold", "confirmed"] }
});

export const SlotReservation = mongoose.model(
  "SlotReservation",
  SlotReservationSchema
);
