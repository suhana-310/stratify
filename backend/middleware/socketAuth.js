import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id)
      .select('-password -refreshTokens')
      .populate('projects', 'name');

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    if (user.status !== 'active') {
      return next(new Error('Authentication error: User account is not active'));
    }

    // Attach user to socket
    socket.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      projects: user.projects.map(p => p._id.toString())
    };

    // Update user's last active time
    user.lastActive = new Date();
    await user.save();

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return next(new Error('Authentication error: Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      return next(new Error('Authentication error: Token expired'));
    }
    
    return next(new Error('Authentication error'));
  }
};