
export interface pendingActionsDTO{
    bookingId:string,
    type:string,
    clientName:string,
    detail:string,
    time:string
}
export interface upcomingAppointmentsDTO{
    bookingId:string,
    clientName:string,
    timeSlot:string,
    service:string,
    status:string,
    profilePic:string
}
export interface recentChatsDTO{
    clientName:string,
    lastMesg:string,
    profilePic:string,
    unread:boolean,
    time:string
}
export interface TrainerMonthlyPerformanceDTO{
    month:string,
    sessionCount:number
}
  export interface TrainerDashboardResponseDTO{
    metrics:{
        monthlyEarning:number,
        upcomingTotal:number,
        todayProgress:string,
        averageRating:number
    },
    pendingActions:pendingActionsDTO[],
    performanceData:TrainerMonthlyPerformanceDTO[],
    recentChats?:recentChatsDTO[]
  }
    export interface TrainerDashboardAppointmentResponseDTO{
        upcomingAppointments:upcomingAppointmentsDTO[]
  }
