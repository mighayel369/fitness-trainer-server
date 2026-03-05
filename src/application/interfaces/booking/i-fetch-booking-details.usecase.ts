

export interface IFetchBookingDetails<bookingResponseDTO>{
    execute(bookingId:string):Promise<bookingResponseDTO>
}