export interface IUpdatableProfile<T> {
  updateData(id: string, data: Partial<T>,file?: Express.Multer.File): Promise<{ success: boolean; data?: T; message?: string }>;
}