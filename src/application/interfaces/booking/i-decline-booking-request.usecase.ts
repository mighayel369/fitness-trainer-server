export interface IDeclineBookingUseCase {
  execute(bookingId: string,reason?:string): Promise<void>;
}