export interface ILoginUseCase {
  execute(email: string, password: string): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    message?: string;
    verifyStatus?: string;
  }>;
}