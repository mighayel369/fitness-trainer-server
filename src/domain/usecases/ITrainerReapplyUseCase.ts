export interface ITrainerReapplyUseCase {
  execute(id: string, payload: any, file?: Express.Multer.File): Promise<{
    success: boolean;
    message?: string;
    trainer?: any;
  }>;
}