import express from 'express';
import { twitterController } from '../controllers/twitterController';
import authenticate from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
// router.use(authenticate);

// Twitter OAuth flow
router.post('/auth', authenticate, twitterController.initiateTwitterAuth);
router.get('/callback', twitterController.callback);

// Twitter actions
router.post('/:integrationId/tweet', twitterController.createTweet);
router.get('/:integrationId/timeline', twitterController.getTimeline);
router.post('/:integrationId/metrics/:postId', twitterController.updateTweetMetrics);

export default router;
