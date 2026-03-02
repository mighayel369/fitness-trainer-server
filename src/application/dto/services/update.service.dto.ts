export interface UpdateServiceRequestDTO {
  serviceId: string;
  name?: string;
  description?: string;
  duration?: number;
  file?: Express.Multer.File;
}