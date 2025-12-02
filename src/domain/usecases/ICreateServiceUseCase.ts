export interface ICreateServiceUseCase<T> {
  create(payload: T): Promise<{
    success: boolean;
    message?: string;
  }>;
}