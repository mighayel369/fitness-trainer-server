export interface IPaginatedResult<T> {
  data: T[];
  totalPages: number;
}
export interface IFindAllUseCase<T> {
  findAll(page: number, search?: string): Promise<IPaginatedResult<T>>;
}