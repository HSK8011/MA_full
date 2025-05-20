"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const User_1 = require("../models/User");
const NotificationPreference_1 = require("../models/NotificationPreference");
const Integration_1 = require("../models/Integration");
const router = express_1.default.Router();
// Get user settings
router.get('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.userId;
        // Get user data
        const user = await User_1.User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get notification preferences
        const notificationPrefs = await NotificationPreference_1.NotificationPreference.find({ userId });
        // Get integrations
        const integrations = await Integration_1.Integration.find({ userId });
        res.json({
            user,
            notificationPreferences: notificationPrefs,
            integrations
        });
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update profile settings
router.put('/profile', authMiddleware_1.default, [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('phone').optional({ nullable: true }),
    (0, express_validator_1.body)('timezone').notEmpty().withMessage('Timezone is required')
], async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.userId;
        const { name, phone, timezone } = req.body;
        console.log('Updating profile for user:', userId);
        console.log('Update data:', { name, phone, timezone });
        const user = await User_1.User.findByIdAndUpdate(userId, {
            name,
            phone,
            timezone,
            updatedAt: new Date() // Explicitly set updatedAt
        }, {
            new: true,
            select: '-password',
            runValidators: true // Enable validation
        });
        console.log('Updated user:', user);
        if (!user) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }
        // Verify the update by fetching the user again
        const verifiedUser = await User_1.User.findById(userId).select('-password');
        console.log('Verified user after update:', verifiedUser);
        res.json({ user });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update notification preferences
router.put('/notifications', authMiddleware_1.default, [
    (0, express_validator_1.body)('preferences').isArray().withMessage('Preferences must be an array'),
    (0, express_validator_1.body)('preferences.*.type').notEmpty().withMessage('Notification type is required'),
    (0, express_validator_1.body)('preferences.*.enabled').isBoolean().withMessage('Enabled status must be a boolean'),
    (0, express_validator_1.body)('preferences.*.frequency').isIn(['daily', 'weekly', 'monthly', 'never']).withMessage('Invalid frequency')
], async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.userId;
        const { preferences } = req.body;
        // Update each preference
        const updatedPrefs = await Promise.all(preferences.map(async (pref) => {
            return NotificationPreference_1.NotificationPreference.findOneAndUpdate({ userId, type: pref.type }, { enabled: pref.enabled, frequency: pref.frequency }, { new: true, upsert: true });
        }));
        res.json({ notificationPreferences: updatedPrefs });
    }
    catch (error) {
        console.error('Error updating notification preferences:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update security settings
router.put('/security', authMiddleware_1.default, [
    (0, express_validator_1.body)('isTwoFactorEnabled').isBoolean().withMessage('Two factor enabled status must be a boolean'),
    (0, express_validator_1.body)('isActivityLoggingEnabled').isBoolean().withMessage('Activity logging enabled status must be a boolean')
], async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.userId;
        const { isTwoFactorEnabled, isActivityLoggingEnabled } = req.body;
        console.log('Updating security settings for user:', userId);
        console.log('Update data:', { isTwoFactorEnabled, isActivityLoggingEnabled });
        const user = await User_1.User.findByIdAndUpdate(userId, {
            isTwoFactorEnabled,
            isActivityLoggingEnabled,
            updatedAt: new Date()
        }, {
            new: true,
            select: '-password',
            runValidators: true
        });
        console.log('Updated user:', user);
        if (!user) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }
        // Verify the update by fetching the user again
        const verifiedUser = await User_1.User.findById(userId).select('-password');
        console.log('Verified user after update:', verifiedUser);
        res.json({ user });
    }
    catch (error) {
        console.error('Error updating security settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
