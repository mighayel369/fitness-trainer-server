export interface IUpdateProfilePicture{
    updateProfilePic(file:Express.Multer.File,id:string):Promise<{success:boolean,imageUrl?:string,message?:string}>
}