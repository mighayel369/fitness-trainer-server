import mongoose, { Document,Schema } from "mongoose";

export interface ITimeRange {
    start: string; 
    end: string;  
}

export interface IBlockedSlot {
    date: string;
    start: string;
    end: string;
    reason?: string;
}

export interface ISlot extends Document {
    trainerId: string;
    weeklyAvailability: {
        monday: ITimeRange[];
        tuesday: ITimeRange[];
        wednesday: ITimeRange[];
        thursday: ITimeRange[];
        friday: ITimeRange[];
        saturday: ITimeRange[];
        sunday: ITimeRange[];
    };
    blockedSlots: IBlockedSlot[];
}


const TimeRangeSchema = new Schema(
    {
        start: { type: String, required: true },
        end: { type: String, required: true }
    },
    { _id: false }
);

const BlockedSlotSchema = new Schema(
    {
        date: { type: String, required: true },
        start: { type: String, required: true },
        end: { type: String, required: true },
        reason: { type: String }
    },
    { _id: false }
);

const SlotSchema = new Schema<ISlot>(
    {
        trainerId: {
            type: String,
            ref: "Trainer",
            required: true,
            unique: true
        },

        weeklyAvailability: {
            monday: { type: [TimeRangeSchema], default: [] },
            tuesday: { type: [TimeRangeSchema], default: [] },
            wednesday: { type: [TimeRangeSchema], default: [] },
            thursday: { type: [TimeRangeSchema], default: [] },
            friday: { type: [TimeRangeSchema], default: [] },
            saturday: { type: [TimeRangeSchema], default: [] },
            sunday: { type: [TimeRangeSchema], default: [] }
        },
        blockedSlots: { type: [BlockedSlotSchema], default: [] }
    },
    {
        timestamps: true
    }
);

export const SlotModel = mongoose.model<ISlot>("Slot", SlotSchema);