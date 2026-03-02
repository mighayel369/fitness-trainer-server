

export interface PerformanceDataDTO{
    month:string,
    revenue:number,
    users:number
}

export interface TopTrainersDTO{
    month:string,
    name:string,
    bookings:number,
    rating:number,
    revenue:number,
    useage:string
}

export interface BookingStatusDTO{
    label: string,
    count:number
}
export interface PeakBookingTimeDataDTO{
    time:string,
    count:number
}


export interface AdminDashbardResponseDTO{
    metrics:{
        totalRevenue:number,
        totalBookings:number,
        totalActiveTrainers:number,
        rententionRate:string
    }
    performanceData:PerformanceDataDTO[],
    topTrainers:TopTrainersDTO[],
    bookingStatus:BookingStatusDTO[],
    peakHoursData:PeakBookingTimeDataDTO[]
}