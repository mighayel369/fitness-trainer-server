export type RescheduleAction = 'approve' | 'reject';

export interface ProcessRescheduleRequestDTO {
  bookingId: string;
  action: RescheduleAction;
}