import { IJwtPayload } from "./types/auth.types";

export interface IJwtService {
  generateAccessToken(payload: IJwtPayload): string;
  generateRefreshToken(payload: IJwtPayload): string;
  verifyAccessToken(token: string): IJwtPayload; 
  verifyRefreshToken(token: string): IJwtPayload;
}