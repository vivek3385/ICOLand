import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'Token is invalid or user no longer exists.' });
      return;
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token has expired. Please login again.' });
    } else {
      res.status(401).json({ error: 'Invalid token.' });
    }
  }
};

// Admin-only middleware
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    return;
  }
  next();
};

// Admin secret key middleware for sensitive admin bootstrap routes
export const requireAdminKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const adminKey = req.headers['x-admin-key'] as string;
  if (!adminKey || adminKey !== env.ADMIN_SECRET_KEY) {
    res.status(403).json({ error: 'Invalid admin key.' });
    return;
  }
  next();
};
