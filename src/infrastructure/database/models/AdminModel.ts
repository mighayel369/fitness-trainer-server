import mongoose, { Schema, Document } from "mongoose";

export interface IAdminDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema = new Schema<IAdminDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.models.admin || mongoose.model<IAdminDocument>('admin', AdminSchema);
export default Admin;