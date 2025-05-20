import express from 'express';
import { analyticsController } from '../controllers/analyticsController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth middleware to all analytics routes
router.use(authMiddleware);

// Get analytics overview for all integrations
router.get('/', analyticsController.getAnalyticsOverview);

// Get analytics for a specific integration/account
router.get('/:integrationId/:timeRange?', analyticsController.getAccountAnalytics);

export default router;
