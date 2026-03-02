import { SlotEntity } from "domain/entities/SlotEntity";

export const SlotMapper = {
  toEntity(doc: any): SlotEntity {
    if (!doc) return null as any;

    return new SlotEntity(
      doc.trainerId,
      doc.weeklyAvailability,
      doc.blockedSlots || []
    );
  }
};
