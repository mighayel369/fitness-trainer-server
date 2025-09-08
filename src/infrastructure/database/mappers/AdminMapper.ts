
import { AdminEntity } from "domain/entities/AdminEntity";

export const AdminMapper = {
  toEntity(doc: any): AdminEntity {
    return new AdminEntity(
      doc.name,
      doc.email,
      doc._id!.toString(),
      doc.password
    );
  }
};
