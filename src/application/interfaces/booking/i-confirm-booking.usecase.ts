export interface IConfirmBookingUseCase {
  execute(bookingId: string): Promise<void>;
}