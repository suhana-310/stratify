import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { protect, validateRefreshToken } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword
} from '../middleware/validation.js';
import { sendEmail } from '../utils/sendEmail.js';
import { generateTokenResponse } from '../utils/auth.js';

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      department,
      status: 'active' // Auto-activate for demo, in production use 'pending'
    });

    // Generate email verification token (for future use)
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    // Send registration success email
    try {
      const { emailTemplates, sendEmail } = await import('../utils/sendEmail.js');
      const emailContent = emailTemplates.registrationSuccess(user.name);
      
      await sendEmail({
        email: user.email,
        subject: emailContent.subject,
        html: emailContent.html
      });
      
      console.log(`📧 Registration confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error('📧 Failed to send registration email:', emailError);
      // Don't fail registration if email fails
    }

    // Generate tokens
    const tokenResponse = generateTokenResponse(user);

    // Emit real-time event for new user registration
    req.io?.emit('user_registered', {
      user: user.profile,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      ...tokenResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please contact support.'
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate tokens
    const tokenResponse = generateTokenResponse(user, rememberMe);

    // Emit real-time event for user login
    req.io?.emit('user_online', {
      userId: user._id,
      user: user.profile,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Login successful',
      ...tokenResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token from user's tokens
      req.user.refreshTokens = req.user.refreshTokens.filter(
        tokenObj => tokenObj.token !== refreshToken
      );
      await req.user.save();
    }

    // Emit real-time event for user logout
    req.io?.emit('user_offline', {
      userId: req.user._id,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', validateRefreshToken, async (req, res) => {
  try {
    const user = req.user;
    const oldRefreshToken = req.refreshToken;

    // Remove old refresh token
    user.refreshTokens = user.refreshTokens.filter(
      tokenObj => tokenObj.token !== oldRefreshToken
    );

    // Clean up expired tokens
    user.cleanupRefreshTokens();

    // Generate new tokens
    const tokenResponse = generateTokenResponse(user, true);

    await user.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      ...tokenResponse
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('projects', 'name status color')
      .select('-password -refreshTokens');

    res.json({
      success: true,
      user: user.profile
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', validateForgotPassword, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email address'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      const { emailTemplates, sendEmail } = await import('../utils/sendEmail.js');
      const emailContent = emailTemplates.passwordReset(user.name, resetUrl);
      
      await sendEmail({
        email: user.email,
        subject: emailContent.subject,
        html: emailContent.html
      });

      console.log(`📧 Password reset email sent to ${user.email}`);

      res.json({
        success: true,
        message: 'Password reset email sent'
      });

    } catch (emailError) {
      console.error('Email send error:', emailError);
      
      // Clear reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset request failed'
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
router.put('/reset-password/:resettoken', validateResetPassword, async (req, res) => {
  try {
    const { password } = req.body;

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Clear all refresh tokens for security
    user.refreshTokens = [];

    await user.save();

    // Send password changed notification email
    try {
      const { emailTemplates, sendEmail } = await import('../utils/sendEmail.js');
      const emailContent = emailTemplates.passwordChanged(user.name);
      
      await sendEmail({
        email: user.email,
        subject: emailContent.subject,
        html: emailContent.html
      });
      
      console.log(`📧 Password changed notification sent to ${user.email}`);
    } catch (emailError) {
      console.error('📧 Failed to send password changed notification:', emailError);
      // Don't fail the password reset if email fails
    }

    // Generate new tokens
    const tokenResponse = generateTokenResponse(user);

    res.json({
      success: true,
      message: 'Password reset successful',
      ...tokenResponse
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed'
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, validateChangePassword, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Set new password
    user.password = newPassword;
    
    // Clear all refresh tokens except current session for security
    user.refreshTokens = [];

    await user.save();

    // Generate new tokens
    const tokenResponse = generateTokenResponse(user);

    res.json({
      success: true,
      message: 'Password changed successfully',
      ...tokenResponse
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password change failed'
    });
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
router.get('/verify-email/:token', async (req, res) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.status = 'active';
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
});

export default router;