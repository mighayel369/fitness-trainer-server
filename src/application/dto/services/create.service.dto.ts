export interface CreateServiceRequestDTO {
  name: string;
  description: string;
  duration: number;
  servicePic?: Express.Multer.File;
}

export interface CreateServiceResponseDTO {
  serviceId: string;
  name: string;
  description: string;
  duration: number;
  servicePic: string;
  status: boolean;
  createdAt?: Date;
}