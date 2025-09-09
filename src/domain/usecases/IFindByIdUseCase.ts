export interface IFindByIdUseCase<T> {
  find(id: string): Promise<T | null>;
}