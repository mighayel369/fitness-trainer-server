import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: "Access Denied. No token provided." });
    return
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload & { id: string; email?: string; role?: string };

    if (decoded.role !== 'user') {
      res.status(403).json({ message: "Not authorized as user " });
      return
    }

    req.user = decoded; 
    next();

  } catch (err) {
     res.status(401).json({ message: 'Invalid or expired token.' });
     return
  }
};