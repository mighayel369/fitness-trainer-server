import mongoose from "mongoose";
import config from "config";

export const connectDB = async (): Promise<boolean> => {
  const MONGO_URI = config.MONGO_URL;
  if (!MONGO_URI) throw new Error("MONGO_URI is missing in .env");

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    return false;
  }
}