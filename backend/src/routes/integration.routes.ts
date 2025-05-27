import express from 'express';
import { integrationController } from '../controllers/integrationController';
import authenticate from '../middleware/authMiddleware';
import twitterRoutes from './twitter.routes';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all social media integrations
router.get('/accounts', integrationController.getSocialMediaIntegrations);

// Initiate OAuth flow for a platform
router.post('/oauth/:platform', integrationController.initiateOAuth);

// Disconnect an account
router.post('/accounts/:integrationId/disconnect', integrationController.disconnectAccount);

// Reconnect an account
router.post('/accounts/:integrationId/reconnect', integrationController.reconnectAccount);

// Update integration settings
router.patch('/accounts/:integrationId', integrationController.updateIntegrationSettings);

// Twitter-specific routes
router.use('/twitter', twitterRoutes);

export default router;