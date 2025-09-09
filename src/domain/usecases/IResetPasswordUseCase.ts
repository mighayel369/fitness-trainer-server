export interface IResetPasswordUseCase {
  sendPasswordLink(email: string): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<{success: boolean;role?: string;}>;
}