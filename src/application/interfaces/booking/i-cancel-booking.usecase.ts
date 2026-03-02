export interface ICancelBooking{
    execute(bookingId:string):Promise<void>
}