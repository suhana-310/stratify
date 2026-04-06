import User from '../models/User.js';

// Generate token response with user data
export const generateTokenResponse = (user, includeRefreshToken = true) => {
  // Generate access token
  const token = user.getSignedJwtToken();
  
  let refreshToken = null;
  
  if (includeRefreshToken) {
    // Generate refresh token
    refreshToken = user.generateRefreshToken();
  }

  // Return user profile without sensitive data
  const userProfile = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    department: user.department,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    lastActive: user.lastActive,
    joinedAt: user.createdAt,
    preferences: user.preferences
  };

  const response = {
    token,
    user: userProfile
  };

  if (refreshToken) {
    response.refreshToken = refreshToken;
  }

  return response;
};

// Extract user ID from JWT token
export const getUserIdFromToken = (token) => {
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Check if user has permission for a resource
export const hasPermission = (user, resource, action) => {
  // Admin has all permissions
  if (user.role === 'admin') {
    return true;
  }

  // Manager has most permissions
  if (user.role === 'manager') {
    const managerPermissions = ['read', 'create', 'update'];
    return managerPermissions.includes(action);
  }

  // Member has limited permissions
  if (user.role === 'member') {
    const memberPermissions = ['read', 'create'];
    return memberPermissions.includes(action);
  }

  return false;
};

// Generate a secure random token
export const generateSecureToken = (length = 32) => {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
};

// Validate password strength
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }

  // Optional: require special characters for stronger security
  // if (!hasSpecialChar) {
  //   errors.push('Password must contain at least one special character');
  // }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

// Calculate password strength score
const calculatePasswordStrength = (password) => {
  let score = 0;

  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety bonus
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  // Pattern penalties
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 1; // Common sequences

  // Normalize score to 0-4 scale
  score = Math.max(0, Math.min(4, score));

  const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return {
    score,
    level: strengthLevels[score]
  };
};

// Clean expired tokens from user
export const cleanupExpiredTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.cleanupRefreshTokens();
      await user.save();
    }
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
};

// Rate limiting helper
export const createRateLimiter = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};