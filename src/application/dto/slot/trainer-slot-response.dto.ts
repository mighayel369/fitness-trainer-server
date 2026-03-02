export interface TimeRangeDTO {
  start: string;
  end: string;
}

export interface WeeklyAvailabilityDTO {
  monday: TimeRangeDTO[];
  tuesday: TimeRangeDTO[];
  wednesday: TimeRangeDTO[];
  thursday: TimeRangeDTO[];
  friday: TimeRangeDTO[];
  saturday: TimeRangeDTO[];
  sunday: TimeRangeDTO[];
}

export interface TrainerSlotResponseDTO {
  trainerId: string;
  weeklyAvailability: WeeklyAvailabilityDTO;
  blockedSlots: {
    date: string;
    start: string;
    end: string;
    reason?: string;
  }[];
}