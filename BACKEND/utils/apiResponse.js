/**
 * Standard API Response and Error utilities
 * Follows unified RESTful envelope structure:
 * { success: boolean, message: string, data?: any, error?: any }
 */

export const successResponse = (res, message = 'Success', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  const payload = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (error && process.env.NODE_ENV !== 'production') {
    payload.error = typeof error === 'string' ? error : error.message || error;
  }

  return res.status(statusCode).json(payload);
};
