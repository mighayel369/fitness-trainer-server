import { UserEntity } from "domain/entities/UserEntity";
export const UserMapper = {
  toEntity(doc: any): UserEntity {
    return new UserEntity(
      doc.name,
      doc.email,
      doc._id!.toString(),
      doc.status,
      doc.role,
      doc.createdAt,
      doc.gender,
      doc.age,
      doc.googleId || null,
      doc.phone || null,   
      doc.address || null,   
      doc.password || null , 
      doc.profilePic || null
    );
  }
};