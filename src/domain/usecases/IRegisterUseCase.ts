export interface IRegisterUseCase<T> {
  execute(payload: T, file?: Express.Multer.File): Promise<{
    success: boolean;
    email?: string;
    message?: string;
  }>;
}