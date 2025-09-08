export interface IPasswordResetService {
  generateResetToken(email: string): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean; role?: string }>;
}