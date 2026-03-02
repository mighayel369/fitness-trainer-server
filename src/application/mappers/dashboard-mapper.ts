import { BookingEntity } from "domain/entities/BookingEntity";
import { 
  pendingActionsDTO, 
  upcomingAppointmentsDTO, 
  TrainerDashboardResponseDTO, 
  TrainerMonthlyPerformanceDTO,
  TrainerDashboardAppointmentResponseDTO
} from "application/dto/dashboard/trainer-dashboard.dto";
import { AdminDashbardResponseDTO } from "application/dto/dashboard/admin-dashboard.dto";

export class DashboardMapper {

  static toPendingActionDTO(booking: BookingEntity): pendingActionsDTO {
    return {
      bookingId:booking.bookingId,
      type: booking.status,
      clientName: booking.user.name,
      detail: booking.rescheduleRequest 
        ? `Requested: ${booking.rescheduleRequest.newTimeSlot}` 
        : `${booking.service} session`,
      time: "Recently" 
    };
  }

static toTrainerMonthlyPerformanceDTO(data:{month:string,sessionCount:number}): TrainerMonthlyPerformanceDTO {
    return {
      month:data.month,
      sessionCount:data.sessionCount||0
    };
  }

  static toUpcomingAppointmentDTO(booking: BookingEntity): upcomingAppointmentsDTO {
    return {
      bookingId:booking.bookingId,
      clientName: booking.user.name,
      timeSlot: booking.timeSlot,
      service: booking.service,
      status: booking.status,
      profilePic: booking.user.profilePic || ""
    };
  }

  static toTrainerDashboardResponseDTO(
    earnings: number,
    pending: BookingEntity[],
    progress: { completed: number; total: number },
    performance: { month: string; sessionCount: number }[],
    upcomingTotal: number,
    rating: number
  ): TrainerDashboardResponseDTO {
    return {
      metrics: {
        monthlyEarning: earnings,
        upcomingTotal: upcomingTotal,
        todayProgress: `${progress.completed}/${progress.total}`,
        averageRating: rating
      },
      pendingActions: pending.map(this.toPendingActionDTO), 
      performanceData: performance.map(p=>this.toTrainerMonthlyPerformanceDTO(p)),
      recentChats: [] 
    };
  }
  
  static torainerAppointmentResponseDTO(appointments:BookingEntity[]):TrainerDashboardAppointmentResponseDTO{
    return {
        upcomingAppointments:appointments.map(p=>this.toUpcomingAppointmentDTO(p))
    }
  }


  static toAdminDashboardResponseDTO(
    analytics: any,
    totalActiveTrainers: number,
    trainerPerformance: any[],
    retentionData: string
  ): AdminDashbardResponseDTO {
    return {
      metrics: {
        totalRevenue: analytics.metrics.totalRevenue || 0,
        totalBookings: analytics.metrics.totalBookings || 0,
        totalActiveTrainers: totalActiveTrainers,
        rententionRate: retentionData.endsWith('%') ? retentionData : `${retentionData}%`
      },
      performanceData: analytics.performanceData || [],
      bookingStatus: analytics.bookingStatus || [],
      peakHoursData: analytics.peakHoursData || [],
      topTrainers: (trainerPerformance || []).map(t => ({
        month: t.month || "Current",
        name: t.name,
        bookings: t.bookings || 0,
        rating: t.rating || 0,
        revenue: t.revenue || 0,
        useage: t.usage || "0%" 
      }))
    };
  }
}