import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  description:string;
  status:boolean;
}

const schema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description:{type:String,required:true},
    status:{type:Boolean,default:true}
  },
  { timestamps: true }
);

export default mongoose.model<IService>("Service", schema);
