import { ProgramMapper } from "./ProgramMapper";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { ITrainer } from "../models/TrainerModel";


export const TrainerMapper = {
  toEntity(doc: ITrainer): TrainerEntity {
    if (!doc) return null as any;

    return new TrainerEntity(
      doc.trainerId,
      doc.name,
      doc.email,
      doc.role,
      doc.verified as any,
      doc.pricePerSession,
      doc.password || null,
      doc.languages || [],
      doc.experience || 0,
      Array.isArray(doc.programs)
        ? doc.programs.map((p: any) => 
            typeof p === 'object' && p.name 
              ? ProgramMapper.toEntity(p) 
              : p 
          )
        : [],
      doc.certificate || null,
      (doc as any).gender || "other",
      doc.rating ?? 0,
      doc.status,
      doc.createdAt,
      doc.bio || null,
      (doc as any).phone || null,
      (doc as any).address || null,
      doc.rejectReason || null,
      doc.profilePic || null
    );
  }
};