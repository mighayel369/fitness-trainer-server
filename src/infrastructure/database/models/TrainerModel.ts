import mongoose, { Schema, Document } from "mongoose";

export interface ITrainer extends Document {
  trainerId: string;
  name: string;
  email: string;
  password?: string;
  status: boolean;
  role: string;
  verified: "pending" | "accepted" | "rejected";
  pricePerSession: number;
  experience?: number;
  programs: string[]; 
  certificate?: string;
  bio?: string;
  rating: number;
  languages: string[];
  gender?: string;
  age?: number;
  phone?: string;
  address?: string;
  rejectReason?: string;
  profilePic?: string;
  createdAt: Date; 
  updatedAt: Date;
}

const TrainerSchema = new Schema<ITrainer>(
  {
    trainerId: { type: String, required: true, trim: true,unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    status: { type: Boolean, default: false },
    role: { type: String, default: "trainer" },
    verified: { 
      type: String, 
      enum: ["pending", "accepted", "rejected"], 
      default: "pending" 
    },
    pricePerSession: { type: Number, required: true },
    experience: { type: Number },
    programs: [{
    type: String, 
    ref: 'Program'
}],
    certificate: { type: String },
    bio: { type: String },
    rating: { type: Number, default: 0 },
    languages: [{ type: String }],
    gender: { type: String },
    age: { type: Number },
    phone: { type: String },
    address: { type: String },
    rejectReason: { type: String },
    profilePic: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<ITrainer>("Trainer", TrainerSchema);