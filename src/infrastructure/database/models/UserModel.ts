import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  status: boolean;
  role: string;
  verified?: "pending" | "accepted" | "rejected";
  bio?:string;
  rejectReason?: string;
  googleId?: string;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  gender?: string;
  age?: number;
  certificate?: string;
  specialization?: string[];
  experience?: string;
  phone?: string;
  address?: string;
  rating?: number;
  languages?: string[];
  pricing?: number;
  timeSlot?:string[];
  profilePic?:string;
}

const schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    status: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    verified: {
      type: String,
      enum: ["pending", "accepted", "rejected"]
    },
    bio:{type:String},
    rejectReason: { type: String },
    googleId: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Number },
    gender: { type: String },
    age: { type: Number },
    certificate: { type: String },
    specialization: [{ type: String }],
    experience: { type: String },
    phone: { type: String },
    address: { type: String },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    languages: [{ type: String }],
    pricing: { type: Number },
    timeSlot: [ { startTime: { type: String, required: true },endTime: { type: String, required: true } }
],
 profilePic: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", schema);
