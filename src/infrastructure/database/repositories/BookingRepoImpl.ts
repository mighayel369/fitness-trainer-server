import { injectable } from "tsyringe";
import { Model } from "mongoose";
import { BaseRepository } from "./BaseRepository";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import Booking, { IBooking } from "../models/BookingModel";
import { BookingEntity } from "domain/entities/BookingEntity";
import { BookingMapper } from "../mappers/BookingMapper";
import { BOOKING_STATUS } from "utils/Constants";


@injectable()
export class BookingRepoImpl
  extends BaseRepository<IBooking, BookingEntity>
  implements IBookingRepo {

  protected model: Model<IBooking> = Booking;

  protected toEntity(doc: IBooking): BookingEntity {
    return BookingMapper.toEntity(doc);
  }



async createBooking(payload: BookingEntity): Promise<BookingEntity> {
  const bookingData = {
    ...payload
  };

  const createdDoc = await this.model.create(bookingData);
  const fullBooking = await this.findBookingById(createdDoc.bookingId);

  if (!fullBooking) {
    throw new Error("Failed to retrieve booking after creation.");
  }

  return fullBooking;
}
  async findBookings(
    searchQuery: string = "",
    filters: Record<string, any> = {},
    page: number = 1,
    limit: number = 5
  ): Promise<{ data: BookingEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    console.log(filters)
    const pipeline: any[] = [{ $match: filters }];

    pipeline.push(
      {
        $lookup: {
          from: "trainers",
          localField: "trainer",
          foreignField: "trainerId",
          as: "trainerInfo"
        }
      },
      { $unwind: "$trainerInfo" },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "userId",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" }
    );

    if (searchQuery) {
      pipeline.push({
        $match: {
          $or: [
            { "trainerInfo.name": { $regex: searchQuery, $options: "i" } },
            { "userInfo.name": { $regex: searchQuery, $options: "i" } },
            { program: { $regex: searchQuery, $options: "i" } },
            { status: { $regex: searchQuery, $options: "i" } }
          ]
        }
      });
    }

    const countPipeline = [...pipeline, { $count: "total" }];
    const countRes = await this.model.aggregate(countPipeline);
    const totalCount = countRes.length > 0 ? countRes[0].total : 0;

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          user: "$userInfo",
          trainer: "$trainerInfo"
        }
      },
      {
        $project: {
          userInfo: 0,
          trainerInfo: 0
        }
      }
    );

    const docs = await this.model.aggregate(pipeline)
    const data = docs.map(d => this.toEntity(d));

    return {
      data,
      totalCount
    };
  }

async findBookedSlots(trainerId: string, date: Date): Promise<string[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await this.model.find({
    trainer: trainerId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $nin: [BOOKING_STATUS.CANCELED, BOOKING_STATUS.REJECTED] }},
  );

  return bookings.map((b) => b.timeSlot);
}
async findBookingById(id: string): Promise<BookingEntity | null> {
  const result = await this.model.aggregate([
    { $match: { bookingId: id } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "userId",
        as: "userDetails"
      }
    },
    {
      $lookup: {
        from: "trainers",
        localField: "trainer",
        foreignField: "trainerId",
        as: "trainerDetails"
      }
    },
    { $unwind:  "$userDetails" },
    { $unwind: "$trainerDetails" },
    {
      $addFields: {
        user: "$userDetails",
        trainer: "$trainerDetails"
      }
    },
    { $project: { userDetails: 0, trainerDetails: 0 } }
  ]);

  if (!result || result.length === 0) return null;
  return this.toEntity(result[0]);
}
async updateBooking(id: string, booking: BookingEntity): Promise<void> {
  const persistenceData = BookingMapper.toPersistence(booking);
  
  await this.model.findOneAndUpdate(
    { bookingId: id },
    { $set: persistenceData },
    { new: true }
  );
}


  async hasActiveBookingsForProgram(programId: string): Promise<boolean> {
    

    const booking = await this.model.exists({
      program: programId,
      status: { $in: [BOOKING_STATUS.PENDING,BOOKING_STATUS.CONFIRMED] }
    });

    return !!booking;
  }

  async checkAvailability(trainerId: string, date: Date, time: string): Promise<boolean> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
    const existingBooking = await this.model.findOne({
      trainerId,
      date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
      timeSlot: time,
      status: { $nin: [BOOKING_STATUS.CANCELED, BOOKING_STATUS.REJECTED] }
    });

    return !!existingBooking;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    await this.model.findOneAndUpdate(
      {bookingId},
      { $set: { status: status } },
    );
  }

  async rescheduleBooking(bookingId: string, data: { newDate: Date, newTimeSlot: string }): Promise<void> {
    await this.model.findOneAndUpdate(
      {bookingId},
      {
        $set: {
          status: BOOKING_STATUS.RESCHEDULE_REQUESTED,
          rescheduleRequest: {
            newDate: data.newDate,
            newTimeSlot: data.newTimeSlot,
            createdAt: new Date()
          }
        }
      }
    );
  }

  async getTodayProgress(trainerId: string): Promise<{ completed: number; total: number }> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const stats = await this.model.aggregate([
      { $match: { trainer: trainerId, date: { $gte: startOfDay, $lte: endOfDay },status:{$in:[BOOKING_STATUS.CONFIRMED,BOOKING_STATUS.COMPLETED]} } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
        }
      }
    ]);

    return stats[0] || { completed: 0, total: 0 };
  }

  async getPerformanceData(trainerId: string): Promise<{ month: string; sessionCount: number }[]> {
    return await this.model.aggregate([
      { $match: { trainer: trainerId, status: BOOKING_STATUS.COMPLETED } },
      {
        $group: {
          _id: { $month: "$date" },
          sessionCount: { $sum: 1 }
        }
      },
      {
        $project: {
          month: { $arrayElemAt: [["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], "$_id"] },
          sessionCount: 1,
          _id: 0
        }
      }
    ]);
  }
  async getMonthlyEarnings(trainerId: string, month: number, year: number): Promise<number> {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    const result = await this.model.aggregate([
      {
        $match: {
          trainer: trainerId,
          status: BOOKING_STATUS.COMPLETED,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$trainerEarning" }
        }
      }
    ]);

    return result.length > 0 ? result[0].totalEarnings : 0;
  }

async getPendingActions(trainerId: string): Promise<BookingEntity[]> {
  const docs = await this.model.aggregate([
    {
      $match: {
        trainer: trainerId,
        status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.RESCHEDULE_REQUESTED] }
      }
    },
    {
      $lookup: {
        from: "trainers",
        localField: "trainer",
        foreignField: "trainerId",
        as: "trainerInfo"
      }
    },
    { $unwind: { path: "$trainerInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "userId",
        as: "userInfo"
      }
    },
    { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },

    {
      $addFields: {
        user: "$userInfo",
        trainer: "$trainerInfo"
      }
    },
    {
      $sort: { updatedAt: -1 }
    },
    {
      $project: {
        userInfo: 0,
        trainerInfo: 0,
        populatedPrograms:0
      }
    }
  ]);

  return docs.map(doc => BookingMapper.toEntity(doc));
}

async getUpcomingAppointmentsByDate(trainerId: string, date: Date): Promise<BookingEntity[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const docs = await this.model.aggregate([
    {
      $match: {
        trainer: trainerId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: {$in:[BOOKING_STATUS.COMPLETED,BOOKING_STATUS.CONFIRMED]}
      }
    },
    {
      $lookup: {
        from: "trainers",
        localField: "trainer",
        foreignField: "trainerId",
        as: "trainerInfo"
      }
    },
    { $unwind:  "$trainerInfo" },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "userId",
        as: "userInfo"
      }
    },
    { $unwind:  "$userInfo" },

    {
      $addFields: {
        user: "$userInfo",
        trainer: "$trainerInfo"
      }
    },
    {
      $sort: { timeSlot: 1 }
    },
    {
      $project: {
        userInfo: 0,
        trainerInfo: 0,
        populatedPrograms:0
      }
    }
  ]);

  return docs.map(doc => this.toEntity(doc));
}

  async findUpcomingBookingCount(trainerId: string): Promise<number> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return await this.model.countDocuments({
      trainer: trainerId,
      date: { $gte: startOfToday },
      status: BOOKING_STATUS.CONFIRMED
    });
  }
  async getAdminDashboardStats(): Promise<any> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);

    const data = await this.model.aggregate([
      {
        $facet: {
          metrics: [
            { $group: { _id: null, totalRevenue: { $sum:{$cond:[{$eq:["$status","completed"]},"$adinCommission",0]}}, totalBookings: { $sum: 1 } } }
          ],
          performanceData: [
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
              $group: {
                _id: { $dateToString: { format: "%b", date: "$createdAt" } },
                revenue: { $sum: "$adminCommission" },
                users: { $addToSet: "$userId" },
                monthIndex: { $first: { $month: "$createdAt" } }
              }
            },
            { $sort: { monthIndex: 1 } },
            { $project: { month: "$_id", revenue: 1, users: { $size: "$users" } } }
          ],
          bookingStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { label: "$_id", count: 1, _id: 0 } }
          ],
          peakHoursData: [
            {
              $project: {
                startTime: { $arrayElemAt: [{ $split: ["$timeSlot", " "] }, 0] },
                amPm: { $arrayElemAt: [{ $split: ["$timeSlot", " "] }, 1] }
              }
            },
            { $group: { _id: { $concat: ["$startTime", " ", "$amPm"] }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 4 },
            { $project: { time: "$_id", count: 1, _id: 0 } }
          ]
        }
      }
    ]);

    return {
      metrics: data[0].metrics[0] || { totalRevenue: 0, totalBookings: 0 },
      performanceData: data[0].performanceData,
      bookingStatus: data[0].bookingStatus,
      peakHoursData: data[0].peakHoursData
    };
  }

  async calculateUserRetention(): Promise<string> {
    const stats = await this.model.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          repeatUsers: { $sum: { $cond: [{ $gt: ["$count", 1] }, 1, 0] } }
        }
      }
    ]);
    if (!stats.length) return "0%";
    const rate = (stats[0].repeatUsers / stats[0].totalUsers) * 100;
    return `${Math.round(rate)}%`;
  }

  async getTrainerPerformanceAnalytics(): Promise<any> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentDayOfMonth = now.getDate();

    const slotsPerDay = 7;
    const totalCapacityToDate = currentDayOfMonth * slotsPerDay;

    return await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: now }
        }
      },
      {
        $group: {
          _id: "$trainer",
          bookings: { $sum: 1 },
          revenue: { $sum: "$trainerEarnings" },
          avgRating: { $avg: "$sessionRating" }
        }
      },
      { $sort: { revenue: -1 } },
      {
        $lookup: {
          from: "trainers",
          localField: "_id",
          foreignField: "trainerId",
          as: "trainerInfo"
        }
      },
      { $unwind: "$trainerInfo" },
      {
        $project: {
          _id: 0,
          month: { $literal: now.toLocaleString('default', { month: 'long' }) },
          name: "$trainerInfo.name",
          bookings: 1,
          rating: { $ifNull: ["$avgRating", 0] },
          revenue: 1,
          useage: {
            $concat: [
              {
                $toString: {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$bookings", totalCapacityToDate] },
                        100
                      ]
                    },
                    0
                  ]
                }
              },
              "%"
            ]
          }
        }
      },
      { $limit: 5 }
    ]);
  }
}