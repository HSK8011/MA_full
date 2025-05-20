import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt, { SignOptions } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { config } from '../config';
import { createDefaultNotificationPreferences } from '../scripts/seedNotificationPreferences';
import { createDefaultIntegrations } from '../scripts/seedIntegrations';
import mongoose from 'mongoose';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// JWT token generation helper
const generateTokens = (userId: string): TokenPair => {
  const accessTokenOptions: SignOptions = {
    expiresIn: 3600 // 1 hour in seconds
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: 604800 // 7 days in seconds
  };

  const accessToken = jwt.sign(
    { userId },
    Buffer.from(config.jwtSecret),
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    Buffer.from(config.jwtSecret),
    refreshTokenOptions
  );

  return { accessToken, refreshToken };
};

// Email configuration
const transporter = nodemailer.createTransport({
  // Configure your email service here
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone: null,
      timezone: 'Culcutta (+05:30)',
      isTwoFactorEnabled: false,
      isActivityLoggingEnabled: true,
      lastPasswordChange: new Date()
    });

    // Set up default settings for the new user
    try {
      // Create default notification preferences
      await createDefaultNotificationPreferences(new mongoose.Types.ObjectId(user._id));
      
      // Create default integrations
      await createDefaultIntegrations(new mongoose.Types.ObjectId(user._id));
    } catch (settingsError) {
      console.error('Error setting up default user settings:', settingsError);
      // Continue with user creation even if settings fail
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(201).json({
      message: 'User created successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwtSecret) as { userId: string; type: string };
      
      // Check if it's actually a refresh token
      if (decoded.type !== 'refresh') {
        res.status(401).json({ message: 'Invalid refresh token' });
        return;
      }

      // Generate new token pair
      const tokens = generateTokens(decoded.userId);

      res.json({
        message: 'Token refreshed successfully',
        ...tokens
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Refresh token has expired', code: 'REFRESH_TOKEN_EXPIRED' });
      } else {
        res.status(401).json({ message: 'Invalid refresh token', code: 'INVALID_REFRESH_TOKEN' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token', error });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Set static OTP token and expiry
    user.resetPasswordToken = '000000';
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await user.save();

    res.json({ 
      message: 'Password reset OTP generated',
      otp: '000000' // In production, you would not send this in response
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating OTP', error });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user with valid OTP
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate new tokens
    const tokens = generateTokens(user._id);

    res.json({
      message: 'Password reset successful',
      ...tokens
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
}; 