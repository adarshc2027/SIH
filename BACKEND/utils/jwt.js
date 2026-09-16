import jwt from 'jsonwebtoken';

/**
 * Generate JWT signed token with user id and role
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'mota_secret_fallback_key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};
