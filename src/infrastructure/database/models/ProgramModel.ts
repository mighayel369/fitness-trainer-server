import mongoose, { Schema, Document } from "mongoose";

export interface IProgram extends Document {
  programId: string; 
  name: string;
  description: string;
  duration: number;
  status: boolean;
  programPic: string;
  isArchived:boolean;
  archivedAt:Date|null;
}

const schema = new Schema<IProgram>(
  {
    programId: { type: String, required: true, trim: true,unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: {
      type: Number,
      required: true,
      min: 60,
      max: 180
    },
    programPic: { type: String },
    status: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  archivedAt: { type: Date, default: null }
  },
  { 
    timestamps: true
  }
);


export default mongoose.model<IProgram>("Program", schema);