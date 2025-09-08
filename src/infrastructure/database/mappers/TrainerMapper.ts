
import { TrainerEntity } from "domain/entities/TrainerEntity";
export const TrainerMapper = {
  toEntity(doc: any): TrainerEntity {
    return new TrainerEntity(
      doc.name,
      doc.email,
      doc._id!.toString(),
      doc.status,
      doc.verified,
      doc.role,
      doc.gender,
      doc.experience,
      doc.specialization,
      doc.certificate,
      doc.createdAt,
      doc.bio ||null,
      doc.googleId || null,
      doc.password || null,
      doc.phone || null,
      doc.address || null,
      doc.rating || 0,
      doc.languages || [],
      doc.pricing || 0,
      doc.rejectReason || null
    );
  }
};
