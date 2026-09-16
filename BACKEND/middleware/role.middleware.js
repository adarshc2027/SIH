import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authorize specified roles
 * Usage: authorize('admin', 'verifier')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'User authentication required before authorization.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access restricted. Role '${req.user.role}' is not authorized to access this resource.`,
        403
      );
    }

    next();
  };
};
