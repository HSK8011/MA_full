"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultNotificationPreferences = exports.DEFAULT_NOTIFICATION_TYPES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationPreference_1 = require("../models/NotificationPreference");
const database_1 = __importDefault(require("../config/database"));
const User_1 = require("../models/User");
exports.DEFAULT_NOTIFICATION_TYPES = [
    {
        type: 'account_update',
        description: 'Received when your account is modified',
        emailEnabled: true,
        desktopEnabled: false
    },
    {
        type: 'new_user_added',
        description: 'Sent when new user is added',
        emailEnabled: true,
        desktopEnabled: false
    },
    {
        type: 'new_social_profile',
        description: 'Sent when new social profile is connected',
        emailEnabled: true,
        desktopEnabled: false
    },
    {
        type: 'new_post_created',
        description: 'Sent when new post created by user',
        emailEnabled: true,
        desktopEnabled: false
    },
    {
        type: 'approval_rejected',
        description: 'Sent when new approval is rejected by admin',
        emailEnabled: true,
        desktopEnabled: true
    },
    {
        type: 'new_approval_requested',
        description: 'Received when new post approval is requested',
        emailEnabled: true,
        desktopEnabled: false
    },
    {
        type: 'approval_approved',
        description: 'Sent to the author when post is approved',
        emailEnabled: true,
        desktopEnabled: false
    },
    {
        type: 'profile_changed',
        description: 'Sent to the author when profile is changed',
        emailEnabled: true,
        desktopEnabled: true
    }
];
/**
 * Create default notification preferences for a new user
 * @param userId - MongoDB ObjectId of the user
 */
const createDefaultNotificationPreferences = async (userId) => {
    try {
        const preferencesToCreate = exports.DEFAULT_NOTIFICATION_TYPES.map(preference => ({
            userId,
            ...preference
        }));
        // Use insertMany for better performance
        await NotificationPreference_1.NotificationPreference.insertMany(preferencesToCreate);
        console.log(`✅ Created default notification preferences for user ${userId}`);
    }
    catch (error) {
        console.error('Error creating default notification preferences:', error);
        throw error;
    }
};
exports.createDefaultNotificationPreferences = createDefaultNotificationPreferences;
/**
 * Run this script directly to seed all notification preferences
 * This is for development/testing purposes only
 */
const seedAllNotificationPreferences = async () => {
    if (process.env.NODE_ENV === 'production') {
        console.error('⛔ This script should not be run in production');
        process.exit(1);
    }
    try {
        await (0, database_1.default)();
        // Get the first user from the database if no user ID is provided
        const user = await User_1.User.findOne();
        const testUserId = process.argv[2] || user?._id;
        if (!testUserId) {
            throw new Error('No user found in the database');
        }
        const userId = new mongoose_1.default.Types.ObjectId(testUserId);
        // Delete existing preferences for this user
        await NotificationPreference_1.NotificationPreference.deleteMany({ userId });
        console.log(`🗑️ Deleted existing notification preferences for user ${userId}`);
        // Create new default preferences
        await (0, exports.createDefaultNotificationPreferences)(userId);
        console.log('✅ Successfully seeded notification preferences');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding notification preferences:', error);
        process.exit(1);
    }
};
// Run the script if called directly (not imported)
if (require.main === module) {
    seedAllNotificationPreferences();
}
