"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';
// Email configuration
const transporter = nodemailer_1.default.createTransport({
    // Configure your email service here
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        let user = await User_1.User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        // Create new user
        user = new User_1.User({
            name,
            email,
            password,
            isEmailVerified: false,
            settings: {
                notifications: {
                    email: true,
                    push: true
                },
                timezone: 'UTC',
                language: 'en',
                analyticsPreferences: {
                    defaultTimeRange: '30d',
                    defaultPlatform: 'all',
                    dashboardLayout: {}
                }
            }
        });
        // Save user (password will be hashed by the pre-save hook)
        await user.save();
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    }
    catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    }
    catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate reset token (in production, this would be a random token)
        const resetToken = '000000'; // Fixed OTP for development
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        // Update user with reset token
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
        // In production, send email with reset token
        // For development, just return success
        res.json({ message: 'Password reset email sent' });
    }
    catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({
            message: 'Error sending reset email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        // Find user
        const user = await User_1.User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        // Password will be hashed by the pre-save hook
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.lastPasswordChange = new Date();
        await user.save();
        // Generate new JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            message: 'Password reset successful',
            token
        });
    }
    catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({
            message: 'Error resetting password',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.resetPassword = resetPassword;
