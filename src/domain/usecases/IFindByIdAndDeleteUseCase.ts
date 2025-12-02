export interface IFindByIdUAndDeleteUseCase{
  delete(id: string): Promise<boolean>;
}