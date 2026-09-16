import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new applicant citizen account
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, tribalCommunity } = req.body;

    if (!name || !email || !password || !phone) {
      return errorResponse(res, 'Please provide all required fields: name, email, password, phone', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists. Please login instead.', 409);
    }

    // Role is defaulted to 'applicant' to prevent unauthorized elevation
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim(),
      role: 'applicant',
      tribalCommunity: tribalCommunity ? tribalCommunity.trim() : ''
    });

    const token = generateToken(user._id, user.role);

    return successResponse(
      res,
      'Registration successful. Welcome to MoTA Scholarship Portal.',
      {
        user: user.toJSON(),
        token
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user (applicant or official) & return JWT
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide both email and password', 400);
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid email or password credentials', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'This account has been deactivated. Please contact Ministry support.', 403);
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password credentials', 401);
    }

    const token = generateToken(user._id, user.role);

    return successResponse(
      res,
      `Authentication successful. Signed in as ${user.role.replace('_', ' ').toUpperCase()}.`,
      {
        user: user.toJSON(),
        token
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user profile
 * @access  Private (Protected by JWT)
 */
export const getMe = async (req, res) => {
  return successResponse(res, 'Profile retrieved successfully', {
    user: req.user
  });
};
