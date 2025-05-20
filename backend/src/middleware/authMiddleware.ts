import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { config } from '../config';

interface JwtPayload {
  userId: string;
  _id: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: string;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔒 [Auth Middleware] Checking authentication');
    
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('📝 Authorization Header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ [Auth Error] Invalid authorization header format');
      return res.status(401).json({ 
        message: 'Invalid authorization header format',
        code: 'INVALID_AUTH_FORMAT'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ [Auth Error] No token provided');
      return res.status(401).json({ 
        message: 'Authentication token is required',
        code: 'TOKEN_REQUIRED'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      console.log('✅ [Auth Success] Token verified for user:', decoded.userId);
      
      // Add user and userId to request
      req.user = decoded;
      req.userId = decoded.userId;
      
      next();
    } catch (error) {
      console.error('❌ [JWT Error]:', error);
      
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ 
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      if (error instanceof JsonWebTokenError) {
        return res.status(401).json({ 
          message: 'Invalid authentication token',
          code: 'INVALID_TOKEN'
        });
      }
      
      return res.status(401).json({ 
        message: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }
  } catch (error) {
    console.error('❌ [Auth Middleware Error]:', error);
    res.status(500).json({ 
      message: 'Internal server error during authentication',
      code: 'AUTH_ERROR'
    });
  }
};

export default auth; 