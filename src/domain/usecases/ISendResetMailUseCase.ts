export interface ISendResetMailUseCase {
  execute(email: string, token: string): Promise<boolean>;
}
