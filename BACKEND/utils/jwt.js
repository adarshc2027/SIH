import jwt from 'jsonwebtoken';

/**
 * Get JWT Secret safely, preventing insecure fallbacks in production
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production environment.');
    }
    return 'mota_secret_fallback_key';
  }
  return secret;
};

/**
 * Generate JWT signed token with user id and role
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};
