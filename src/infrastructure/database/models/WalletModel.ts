
import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  ownerId: string;
  balance: number;
  holds: {
    bookingId: string;
    amount: number;
    status: "active" | "released" | "converted";
    createdAt: Date;
  }[];
  transactions: {
    type: "credit" | "debit";
    amount: number;
    source: "booking" | "refund" | "admin";
    bookingId?: string;
    createdAt: Date;
  }[];
}

const WalletSchema = new Schema<IWallet>(
  {
    ownerId: { type: String, required: true, trim: true,unique: true },
    balance: { type: Number, default: 0 },
    holds: [
      {
        bookingId: String,
        amount: Number,
        status: {
          type: String,
          enum: ["active", "released", "converted"],
          default: "active"
        },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    transactions: [
      {
        type: { type: String, enum: ["credit", "debit"] },
        amount: Number,
        source: {
          type: String,
          enum: ["booking", "refund", "admin"]
        },
        bookingId: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true
  }
);

WalletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

export default mongoose.model<IWallet>("Wallet", WalletSchema);
