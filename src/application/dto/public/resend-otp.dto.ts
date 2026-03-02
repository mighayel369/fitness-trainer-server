
export interface ResendOtpRequestDTO {
  email: string;
  role: 'user' | 'trainer';
}