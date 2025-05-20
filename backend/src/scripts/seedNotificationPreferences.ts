import mongoose from 'mongoose';
import { NotificationPreference } from '../models/NotificationPreference';
import connectDB from '../config/database';
import { config } from '../config';
import { User } from '../models/User';

export const DEFAULT_NOTIFICATION_TYPES = [
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
export const createDefaultNotificationPreferences = async (userId: mongoose.Types.ObjectId) => {
  try {
    const preferencesToCreate = DEFAULT_NOTIFICATION_TYPES.map(preference => ({
      userId,
      ...preference
    }));
    
    // Use insertMany for better performance
    await NotificationPreference.insertMany(preferencesToCreate);
    console.log(`✅ Created default notification preferences for user ${userId}`);
    
  } catch (error) {
    console.error('Error creating default notification preferences:', error);
    throw error;
  }
};

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
    await connectDB();
    
    // Get the first user from the database if no user ID is provided
    const user = await User.findOne();
    const testUserId = process.argv[2] || user?._id;
    
    if (!testUserId) {
      throw new Error('No user found in the database');
    }
    
    const userId = new mongoose.Types.ObjectId(testUserId);
    
    // Delete existing preferences for this user
    await NotificationPreference.deleteMany({ userId });
    console.log(`🗑️ Deleted existing notification preferences for user ${userId}`);
    
    // Create new default preferences
    await createDefaultNotificationPreferences(userId);
    
    console.log('✅ Successfully seeded notification preferences');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding notification preferences:', error);
    process.exit(1);
  }
};

// Run the script if called directly (not imported)
if (require.main === module) {
  seedAllNotificationPreferences();
} 