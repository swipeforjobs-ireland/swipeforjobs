import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface JWTPayload {
  userId: string;
  email: string;
  subscriptionTier: string;
}

export class AuthUtils {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token (FIXED)
  static generateToken(payload: JWTPayload): string {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    return jwt.verify(token, secret) as JWTPayload;
  }
}

// Auth middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const decoded = AuthUtils.verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
      timestamp: new Date().toISOString()
    });
  }
};