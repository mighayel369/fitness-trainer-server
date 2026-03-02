
import { UserEntity } from "domain/entities/UserEntity";
import { IUser } from "../models/UserModel";

export const UserMapper = {
  toEntity(doc: IUser): UserEntity {
    return new UserEntity(
      doc.name,  
      doc.email,      
      doc.userId,      
      doc.role,           
      doc.password||'',    
      doc.status,         
      doc.createdAt,      
      doc.gender,    
      doc.age,        
      doc.googleId || null,
      doc.phone || null,  
      doc.address || null, 
      doc.profilePic || null 
    );
  }
};