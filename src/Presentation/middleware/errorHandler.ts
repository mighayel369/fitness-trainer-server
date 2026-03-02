import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';

export const errorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof AppError) {
   console.log(err)
   res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return
  }

  console.error("Internal Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server"
  });
  return
};