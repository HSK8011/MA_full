"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
// Email configuration
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.config.emailUser,
        pass: config_1.config.emailPassword,
    },
});
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';
const JWT_EXPIRES_IN = '24h';
const register = async (req, res) => {
    try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email'
            });
        }
        // Create new user
        const user = new User_1.User({
            name,
            email,
            password
        });
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.config.jwtSecret, { expiresIn: '24h' });
        // Return success response
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
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Find user by email
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.config.jwtSecret, { expiresIn: '24h' });
        // Return success response
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
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email } = req.body;
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        await user.save();
        // Send email
        const resetURL = `${config_1.config.frontendUrl}/reset-password/${resetToken}`;
        const mailOptions = {
            from: config_1.config.emailUser,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
        <h1>Password Reset Request</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetURL}">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset email sent' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            message: 'Error sending reset email',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { token, newPassword } = req.body;
        // Hash token
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        // Find user with valid token
        const user = await User_1.User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        // Generate new token
        const newToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.config.jwtSecret, { expiresIn: '24h' });
        res.json({
            message: 'Password reset successful',
            token: newToken,
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            message: 'Error resetting password',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.resetPassword = resetPassword;
