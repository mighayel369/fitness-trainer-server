export interface IBlockUnblockUseCase {
  updateStatus(id: string,status:boolean): Promise<void>;
}