import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/authMiddleware';
import {
  getUserProfile,
  updateUserProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
  getSecuritySettings,
  changePassword,
  toggleTwoFactorAuth,
  toggleActivityLogs,
  getQueueSettings,
  updateQueueSettings
} from '../controllers/userSettingsController';

const router = express.Router();

// Get all settings
router.get('/', auth, getUserProfile);

// Profile routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').optional({ nullable: true }),
  body('timezone').notEmpty().withMessage('Timezone is required')
], updateUserProfile);

// Notification routes
router.get('/notifications', auth, getNotificationPreferences);
router.put('/notifications', auth, [
  body('preferences').isArray().withMessage('Preferences must be an array'),
  body('preferences.*.type').notEmpty().withMessage('Notification type is required'),
  body('preferences.*.enabled').isBoolean().withMessage('Enabled status must be a boolean'),
  body('preferences.*.frequency').isIn(['daily', 'weekly', 'monthly', 'never']).withMessage('Invalid frequency')
], updateNotificationPreferences);

// Security routes
router.get('/security', auth, getSecuritySettings);
router.put('/security/password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
], changePassword);
router.put('/security/2fa', auth, toggleTwoFactorAuth);
router.put('/security/activity-logs', auth, toggleActivityLogs);

// Queue settings routes
router.get('/queue', auth, getQueueSettings);
router.put('/queue', auth, [
  body('queueTimes').isArray().withMessage('Queue times must be an array'),
  body('queueTimes.*.day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).withMessage('Invalid day'),
  body('queueTimes.*.startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format (HH:mm)'),
  body('queueTimes.*.endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format (HH:mm)')
], updateQueueSettings);

export default router; 