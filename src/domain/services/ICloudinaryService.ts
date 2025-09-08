export interface ICloudinaryService{
    getTrainerCertificateUrl(file:Express.Multer.File,email:string):Promise<string>
    deleteTrainerCertificate(publicId: string):Promise<boolean>
}