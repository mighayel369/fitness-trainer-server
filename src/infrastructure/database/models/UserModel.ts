

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password?: string;
  status: boolean;
  role: string;
  gender?: string;
  age?: number;
  phone?: string;
  address?: string;
  profilePic?: string;
  googleId?: string;
  createdAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: number;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, trim: true,unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    status: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    gender: { type: String },
    age: { type: Number },
    phone: { type: String },
    address: { type: String },
    profilePic: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);