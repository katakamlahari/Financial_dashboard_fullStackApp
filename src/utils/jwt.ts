import jwt, { SignOptions } from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

export const generateToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRY as unknown as number,
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (
  authHeader: string | undefined,
): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
