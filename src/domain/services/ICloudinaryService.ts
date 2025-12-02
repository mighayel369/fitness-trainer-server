export interface ICloudinaryService{
    getTrainerCertificateUrl(file:Express.Multer.File,email:string):Promise<string>
    getProfilePictureUrl(file:Express.Multer.File,id:string):Promise<string>
}