export interface ISendPasswordResetLinkUseCase {
  execute(email: string): Promise<void>;
}