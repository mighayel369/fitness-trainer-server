import jwt from 'jsonwebtoken';
import config from "config";
import { injectable } from 'tsyringe';
import { IJwtService } from '../../domain/services/i-jwt.service';
import { IJwtPayload } from 'domain/services/types/auth.types';

@injectable()
export class JwtService implements IJwtService {
  generateAccessToken(payload: IJwtPayload): string {
    console.log(payload)
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: IJwtPayload): string {
    console.log(payload)
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  verifyAccessToken(token: string): IJwtPayload {
    return jwt.verify(token, config.JWT_SECRET) as IJwtPayload;
  }

  verifyRefreshToken(token: string): IJwtPayload {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as IJwtPayload;
  }
}