import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  serviceId: string; 
  name: string;
  description: string;
  duration: number;
  status: boolean;
  servicePic: string;
  isDeleted:boolean;
  deletedAt:Date|null;
}

const schema = new Schema<IService>(
  {
    serviceId: { type: String, required: true, trim: true,unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: {
      type: Number,
      required: true,
      min: 60,
      max: 180
    },
    servicePic: { type: String },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
  },
  { 
    timestamps: true
  }
);


export default mongoose.model<IService>("Service", schema);