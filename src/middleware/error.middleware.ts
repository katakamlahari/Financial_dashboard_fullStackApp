import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import { ZodError } from 'zod';
import logger from '@/utils/logger';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  timestamp: string;
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();

  logger.error(`[${timestamp}] Error:`, error);

  if (error instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        message: error.message,
      },
      timestamp,
    };
    return res.status(error.statusCode).json(response);
  }

  if (error instanceof ZodError) {
    const response: ApiResponse = {
      success: false,
      error: {
        message: 'Validation error',
        details: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      timestamp,
    };
    return res.status(400).json(response);
  }

  const response: ApiResponse = {
    success: false,
    error: {
      message: error.message || 'Internal server error',
    },
    timestamp,
  };

  res.status(500).json(response);
};

export const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const successResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message: string = 'Request successful',
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};
