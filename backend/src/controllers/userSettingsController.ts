import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { NotificationPreference } from '../models/NotificationPreference';
import { QueueSetting } from '../models/QueueSetting';
import { Integration } from '../models/Integration';
import { ActivityLog } from '../models/ActivityLog';
import { DEFAULT_NOTIFICATION_TYPES } from '../scripts/seedNotificationPreferences';
import { DEFAULT_INTEGRATIONS } from '../scripts/seedIntegrations';

// Extend Express Request type to include userId from auth middleware
interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Get all user settings
 */
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    // Get all settings in parallel
    const [user, notificationPreferences, integrations] = await Promise.all([
      User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires'),
      NotificationPreference.find({ userId }).sort({ type: 1 }),
      Integration.find({ userId }).sort({ type: 1 })
    ]);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Create default notification preferences if none exist
    let finalNotificationPreferences = notificationPreferences;
    if (notificationPreferences.length === 0) {
      const defaultPreferences = DEFAULT_NOTIFICATION_TYPES.map(pref => ({
        userId: new mongoose.Types.ObjectId(userId),
        ...pref
      }));
      await NotificationPreference.insertMany(defaultPreferences);
      finalNotificationPreferences = await NotificationPreference.find({ userId }).sort({ type: 1 });
    }

    // Create default integrations if none exist
    let finalIntegrations = integrations;
    if (integrations.length === 0) {
      const defaultIntegrations = DEFAULT_INTEGRATIONS.map(integration => ({
        userId: new mongoose.Types.ObjectId(userId),
        ...integration
      }));
      await Integration.insertMany(defaultIntegrations);
      finalIntegrations = await Integration.find({ userId }).sort({ type: 1 });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        timezone: user.timezone,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        isActivityLoggingEnabled: user.isActivityLoggingEnabled,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      notificationPreferences: finalNotificationPreferences,
      integrations: finalIntegrations
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Error fetching user settings', error });
  }
};

/**
 * Update user profile settings
 */
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { name, phone, timezone } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    // Validation
    if (name && (name.length < 2 || name.length > 50)) {
      res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
      return;
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { 
        name: name,
        phone: phone,
        timezone: timezone
      },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Log activity if enabled
    if (updatedUser.isActivityLoggingEnabled) {
      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: 'profile_update',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date(),
        metadata: {
          updated: { name, phone, timezone }
        }
      });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        timezone: updatedUser.timezone
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};

/**
 * Get user notification preferences
 */
export const getNotificationPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    // Find user's notification preferences
    let preferences = await NotificationPreference.find({ userId }).sort({ type: 1 });
    
    // If no preferences exist, create defaults
    if (preferences.length === 0) {
      const defaultPreferences = DEFAULT_NOTIFICATION_TYPES.map(pref => ({
        userId: new mongoose.Types.ObjectId(userId),
        ...pref
      }));
      
      await NotificationPreference.insertMany(defaultPreferences);
      preferences = await NotificationPreference.find({ userId }).sort({ type: 1 });
    }
    
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ message: 'Error fetching notification preferences', error });
  }
};

/**
 * Update user notification preferences
 */
export const updateNotificationPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { preferences } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    if (!Array.isArray(preferences)) {
      res.status(400).json({ message: 'Invalid preferences format' });
      return;
    }
    
    // Update each preference
    const updatePromises = preferences.map(async (pref) => {
      // Create an update object with only the fields that are provided
      const updateFields: any = {};
      
      if (pref.emailEnabled !== undefined) {
        updateFields.emailEnabled = pref.emailEnabled;
      }
      
      if (pref.emailFrequency !== undefined) {
        updateFields.emailFrequency = pref.emailFrequency;
      } else if (pref.emailEnabled !== undefined) {
        // If emailEnabled is toggled but no frequency is provided, set a default
        updateFields.emailFrequency = pref.emailEnabled ? 'daily' : 'never';
      }
      
      if (pref.desktopEnabled !== undefined) {
        updateFields.desktopEnabled = pref.desktopEnabled;
      }
      
      return NotificationPreference.findOneAndUpdate(
        { userId, _id: pref._id },
        updateFields,
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    // Get updated preferences
    const updatedPreferences = await NotificationPreference.find({ userId }).sort({ type: 1 });
    
    // Log activity if user has activity logging enabled
    const user = await User.findById(userId);
    if (user?.isActivityLoggingEnabled) {
      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: 'settings_changed',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date(),
        metadata: {
          setting: 'notification_preferences'
        }
      });
    }
    
    res.json({
      message: 'Notification preferences updated successfully',
      preferences: updatedPreferences
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ message: 'Error updating notification preferences', error });
  }
};

/**
 * Get user security settings
 */
export const getSecuritySettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    const user = await User.findById(userId).select('isTwoFactorEnabled isActivityLoggingEnabled lastPasswordChange');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json({
      twoFactorEnabled: user.isTwoFactorEnabled,
      activityLogsEnabled: user.isActivityLoggingEnabled,
      lastPasswordChange: user.lastPasswordChange
    });
  } catch (error) {
    console.error('Error fetching security settings:', error);
    res.status(500).json({ message: 'Error fetching security settings', error });
  }
};

/**
 * Change user password
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    // Validation
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }
    
    if (newPassword.length < 8) {
      res.status(400).json({ message: 'New password must be at least 8 characters long' });
      return;
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }
    
    // Update password
    user.password = newPassword;
    user.lastPasswordChange = new Date();
    await user.save();
    
    // Log activity if enabled
    if (user.isActivityLoggingEnabled) {
      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: 'password_change',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date()
      });
    }
    
    res.json({
      message: 'Password changed successfully',
      lastPasswordChange: user.lastPasswordChange
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error });
  }
};

/**
 * Toggle two-factor authentication
 */
export const toggleTwoFactorAuth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { enabled } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { isTwoFactorEnabled: enabled },
      { new: true }
    );
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Log activity if enabled
    if (user.isActivityLoggingEnabled) {
      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: enabled ? 'two_factor_enabled' : 'two_factor_disabled',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date()
      });
    }
    
    res.json({
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
      twoFactorEnabled: user.isTwoFactorEnabled
    });
  } catch (error) {
    console.error('Error toggling two-factor authentication:', error);
    res.status(500).json({ message: 'Error toggling two-factor authentication', error });
  }
};

/**
 * Toggle activity logs
 */
export const toggleActivityLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { enabled } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { isActivityLoggingEnabled: enabled },
      { new: true }
    );
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Log activity (regardless of new setting - we log the change itself)
    await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      action: 'security_setting_change',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
      metadata: {
        setting: 'activity_logging',
        enabled: enabled
      }
    });
    
    res.json({
      message: `Activity logging ${enabled ? 'enabled' : 'disabled'} successfully`,
      activityLogsEnabled: user.isActivityLoggingEnabled
    });
  } catch (error) {
    console.error('Error toggling activity logs:', error);
    res.status(500).json({ message: 'Error toggling activity logs', error });
  }
};

/**
 * Get available integrations
 */
export const getIntegrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    // Find user's integrations
    let integrations = await Integration.find({ userId }).sort({ serviceName: 1 });
    
    // If no integrations exist, create defaults
    if (integrations.length === 0) {
      const defaultIntegrations = DEFAULT_INTEGRATIONS.map(integration => ({
        userId: new mongoose.Types.ObjectId(userId),
        ...integration,
        credentials: {}
      }));
      
      await Integration.insertMany(defaultIntegrations);
      integrations = await Integration.find({ userId }).sort({ serviceName: 1 });
    }
    
    res.json(integrations);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ message: 'Error fetching integrations', error });
  }
};

/**
 * Toggle integration connection status
 */
export const toggleIntegrationConnection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { serviceId, isConnected, credentials } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    if (!serviceId) {
      res.status(400).json({ message: 'Service ID is required' });
      return;
    }
    
    // Find integration
    const integration = await Integration.findOne({ userId, serviceId });
    
    if (!integration) {
      res.status(404).json({ message: 'Integration not found' });
      return;
    }
    
    // Update integration
    integration.isConnected = isConnected;
    
    if (credentials) {
      integration.credentials = credentials;
    }
    
    if (isConnected) {
      integration.lastConnectedAt = new Date();
    }
    
    await integration.save();
    
    // Log activity if user has activity logging enabled
    const user = await User.findById(userId);
    if (user?.isActivityLoggingEnabled) {
      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: isConnected ? 'integration_connected' : 'integration_disconnected',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date(),
        metadata: {
          serviceId: serviceId,
          serviceName: integration.serviceName
        }
      });
    }
    
    res.json({
      message: `Integration ${isConnected ? 'connected' : 'disconnected'} successfully`,
      integration: {
        serviceId: integration.serviceId,
        serviceName: integration.serviceName,
        serviceType: integration.serviceType,
        isConnected: integration.isConnected,
        lastConnectedAt: integration.lastConnectedAt,
        metadata: integration.metadata
      }
    });
  } catch (error) {
    console.error('Error toggling integration connection:', error);
    res.status(500).json({ message: 'Error toggling integration connection', error });
  }
};

/**
 * Get queue settings for a specific account
 */
export const getQueueSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { accountId } = req.query;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    if (!accountId) {
      res.status(400).json({ message: 'Account ID is required' });
      return;
    }
    
    // Find queue settings
    let queueSettings = await QueueSetting.findOne({ 
      userId, 
      accountId: accountId.toString() 
    });
    
    // If no settings exist, create default
    if (!queueSettings) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const weekdaySettings = days.map(day => ({
        day,
        enabled: ['saturday', 'sunday'].includes(day) ? false : true,
        timeSlots: ['saturday', 'sunday'].includes(day) ? [] : [
          { time: '09:00' },
          { time: '12:00' },
          { time: '15:00' }
        ]
      }));
      
      queueSettings = await QueueSetting.create({
        userId: new mongoose.Types.ObjectId(userId),
        accountId: accountId.toString(),
        weekdaySettings
      });
    }
    
    res.json(queueSettings);
  } catch (error) {
    console.error('Error fetching queue settings:', error);
    res.status(500).json({ message: 'Error fetching queue settings', error });
  }
};

/**
 * Update queue settings for a specific account
 */
export const updateQueueSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { accountId, weekdaySettings } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID not found in request' });
      return;
    }
    
    if (!accountId || !weekdaySettings) {
      res.status(400).json({ message: 'Account ID and weekday settings are required' });
      return;
    }
    
    // Validate weekday settings
    if (!Array.isArray(weekdaySettings) || weekdaySettings.length !== 7) {
      res.status(400).json({ message: 'Weekday settings must contain exactly 7 days' });
      return;
    }
    
    // Find or create queue settings
    let queueSettings = await QueueSetting.findOne({ userId, accountId });
    
    if (queueSettings) {
      // Update existing settings
      queueSettings.weekdaySettings = weekdaySettings;
      await queueSettings.save();
    } else {
      // Create new settings
      queueSettings = await QueueSetting.create({
        userId: new mongoose.Types.ObjectId(userId),
        accountId,
        weekdaySettings
      });
    }
    
    res.json({
      message: 'Queue settings updated successfully',
      queueSettings
    });
  } catch (error) {
    console.error('Error updating queue settings:', error);
    res.status(500).json({ message: 'Error updating queue settings', error });
  }
}; 