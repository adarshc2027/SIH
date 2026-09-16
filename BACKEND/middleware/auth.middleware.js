import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect routes: verify JWT Bearer token and attach current user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Access denied. No authentication token provided.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mota_secret_fallback_key');

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 'Authentication failed. User no longer exists.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account suspended. Please contact Ministry administrator.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session token has expired. Please sign in again.', 401);
    }
    return errorResponse(res, 'Invalid or malformed authentication token.', 401);
  }
};
