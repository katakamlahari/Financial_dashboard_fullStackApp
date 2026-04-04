import { Request, Response, NextFunction } from 'express';
import { JWTPayload, extractTokenFromHeader, verifyToken } from '@/utils/jwt';
import { UnauthorizedError } from '@/utils/errors';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError('You do not have permission to access this resource'),
      );
    }

    next();
  };
};

import { ForbiddenError } from '@/utils/errors';
