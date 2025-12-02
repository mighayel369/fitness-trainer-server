import { TrainerSlotEntity } from "domain/entities/TrainerSlotEntity";

export const TrainerSlotMapper = {
  toEntity(doc: any): TrainerSlotEntity {
    return new TrainerSlotEntity(
      doc._id?.toString() || "",
      doc.trainerId?.toString() || "",
      doc.date,
      doc.startTime,
      doc.endTime,
      doc.status,
      doc.bookedBy?.toString() || null
    );
  }
};
