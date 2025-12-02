
export interface IFindAllUseCase<T> {
  findAll(page: number,limit: number,search?: string): Promise<{ data: T[]; totalPages: number }>
}