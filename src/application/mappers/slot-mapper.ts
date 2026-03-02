import { SlotEntity } from "domain/entities/SlotEntity";
import { TrainerSlotResponseDTO } from "application/dto/slot/trainer-slot-response.dto";
export class SlotMapper{
    static toTrainerSlotResponseDTO(entity: SlotEntity): TrainerSlotResponseDTO {
    return {
      trainerId: entity.trainerId,
      weeklyAvailability: {
        monday: entity.weeklyAvailability.monday.map(r => ({ start: r.start, end: r.end })),
        tuesday: entity.weeklyAvailability.tuesday.map(r => ({ start: r.start, end: r.end })),
        wednesday: entity.weeklyAvailability.wednesday.map(r => ({ start: r.start, end: r.end })),
        thursday: entity.weeklyAvailability.thursday.map(r => ({ start: r.start, end: r.end })),
        friday: entity.weeklyAvailability.friday.map(r => ({ start: r.start, end: r.end })),
        saturday: entity.weeklyAvailability.saturday.map(r => ({ start: r.start, end: r.end })),
        sunday: entity.weeklyAvailability.sunday.map(r => ({ start: r.start, end: r.end })),
      },
      blockedSlots: entity.blockedSlots.map(b => ({
        date: b.date,
        start: b.start,
        end: b.end,
        reason: b.reason
      }))
    };
  }
}