import { injectable } from "tsyringe";
import { v2 as cloudinary } from "cloudinary";
import config from "config";
import { ICloudinaryService } from "domain/services/ICloudinaryService";

@injectable()

export class CloudinaryService implements ICloudinaryService{
    constructor(){
        cloudinary.config({
            cloud_name: config.CLOUDINARY_CLOUD_NAME,
            api_key: config.CLOUDINARY_API_KEY,
            api_secret: config.CLOUDINARY_API_SECRET
        })
    }

    async getTrainerCertificateUrl(file: Express.Multer.File, email: string): Promise<string> {
        try{
            const result=await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder:"trainer-certificates",
                    public_id: `trainer-${email}`,
                    overwrite: true
                }
            )
            return result.secure_url;
        }catch(error){
               console.error("Cloudinary upload failed:", error);
               throw new Error("Failed to upload trainer certificate");
        }
    }



       async getProfilePictureUrl(file: Express.Multer.File, id: string): Promise<string> {
        try{
            const result=await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder:"profile-pictures",
                    public_id: `trainer-${id}`,
                    overwrite: true
                }
            )
            return result.secure_url;
        }catch(error){
               console.error("Cloudinary upload failed:", error);
               throw new Error("Failed to upload trainer certificate");
        }
    }
}