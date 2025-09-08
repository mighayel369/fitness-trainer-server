export interface IRefreshAccessTokenUseCase {
  execute(refreshToken: string): Promise<{
    success: boolean;
    accessToken?: string;
    message?: string;
  }>;
}
