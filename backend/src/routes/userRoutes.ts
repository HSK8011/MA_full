import express from 'express';
import auth from '../middleware/authMiddleware';
import * as userSettingsController from '../controllers/userSettingsController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Profile settings routes
router.get('/profile', userSettingsController.getUserProfile);
router.put('/profile', userSettingsController.updateUserProfile);

// Notification settings routes
router.get('/notification-preferences', userSettingsController.getNotificationPreferences);
router.put('/notification-preferences', userSettingsController.updateNotificationPreferences);

// Security settings routes
router.get('/security-settings', userSettingsController.getSecuritySettings);
router.put('/security/change-password', userSettingsController.changePassword);
router.put('/security/2fa', userSettingsController.toggleTwoFactorAuth);
router.put('/security/activity-logs', userSettingsController.toggleActivityLogs);

// General settings and integrations routes
router.get('/integrations', userSettingsController.getIntegrations);
router.put('/integrations/connect', userSettingsController.toggleIntegrationConnection);

// Queue settings routes
router.get('/queue-settings', userSettingsController.getQueueSettings);
router.put('/queue-settings', userSettingsController.updateQueueSettings);

export default router; 