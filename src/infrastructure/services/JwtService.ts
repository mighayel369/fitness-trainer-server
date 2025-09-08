import jwt from 'jsonwebtoken';
import config from "config";

export class JwtService {
  
  static generateAccessToken(payload: object) {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' })
  }

  static generateRefreshToken(payload: object) {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '7d' })
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, config.JWT_SECRET);
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
  }
}
