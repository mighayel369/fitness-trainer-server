export interface TimeRange {
  start: string;  
  end: string;   
}

export interface WeeklyAvailability {
  monday: TimeRange[];
  tuesday: TimeRange[];
  wednesday: TimeRange[];
  thursday: TimeRange[];
  friday: TimeRange[];
  saturday: TimeRange[];
  sunday: TimeRange[];
}

export interface BlockedSlot {
  date: string;
  start: string;
  end: string;
  reason?: string;
}



export class SlotEntity {
  constructor(
    public readonly trainerId: string,
    public readonly weeklyAvailability: WeeklyAvailability,
    public readonly blockedSlots: BlockedSlot[]
  ) {}
}
