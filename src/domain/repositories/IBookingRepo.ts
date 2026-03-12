
import { BookingEntity} from "domain/entities/BookingEntity";

export interface IBookingRepo {
  createBooking(payload:BookingEntity): Promise<BookingEntity|null>;
  findBookingById(id: string): Promise<BookingEntity | null>;
  updateBooking(bookingId: string, data: BookingEntity): Promise<void>;
  findBookings(searchQuery:string,filter?: object, page?: number, limit?: number): Promise<{ data: BookingEntity[]; totalCount: number }>;
  findBookedSlots(trainerId: string, date: Date): Promise<string[]>;
  hasActiveBookingsForProgram(programId: string): Promise<boolean>;
  checkAvailability(trainerId: string, date: Date, time: string): Promise<boolean>
  updateBookingStatus(bookingId: string, status: "pending" | "confirmed" | "rejected" | "cancelled"): Promise<void>;
  rescheduleBooking(bookingId: string, data: {newDate:Date,newTimeSlot:string}): Promise<void>
  getMonthlyEarnings(trainerId: string, month: number, year: number): Promise<number>;
  getPendingActions(trainerId: string): Promise<BookingEntity[]>;
  getTodayProgress(trainerId: string): Promise<{ completed: number; total: number }>;
  getUpcomingAppointmentsByDate(trainerId: string, date: Date): Promise<BookingEntity[]>;
  getPerformanceData(trainerId: string): Promise<{ month: string; sessionCount: number }[]>;
  findUpcomingBookingCount(trainerId:string):Promise<number>
  getAdminDashboardStats(): Promise<{
    metrics: { totalRevenue: number; totalBookings: number };
    performanceData: any[];
    bookingStatus: { label: string; count: number }[];
    peakHoursData: { time: string; count: number }[];
  }>;
  getTrainerPerformanceAnalytics(): Promise<any[]>;
  calculateUserRetention(): Promise<string>;
}
