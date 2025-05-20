import { Request, Response } from 'express';
import { Analytics } from '../models/Analytics';
import { Integration } from '../models/Integration';
import { Post } from '../models/Post';
import { handleAsync } from '../utils/handleAsync';

// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
}

export const analyticsController = {
  // Get analytics for a specific integration/account
  getAccountAnalytics: handleAsync(async (req: AuthRequest, res: Response) => {
    const { integrationId, timeRange = '30d' } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }

    console.log('🔍 [Analytics] Fetching analytics for integration:', integrationId);
    console.log('📝 [Query Params]:', {
      userId,
      integrationId,
      timeRange
    });

    // First, verify the integration belongs to the user
    const integration = await Integration.findOne({
      _id: integrationId,
      userId
    });

    if (!integration) {
      return res.status(404).json({ 
        message: 'Integration not found',
        code: 'INTEGRATION_NOT_FOUND'
      });
    }

    // Get analytics data
    const analytics = await Analytics.findOne({
      integrationId,
      userId,
      timeRange
    }).sort({ date: -1 }); // Get the most recent analytics

    if (!analytics) {
      return res.status(404).json({ 
        message: 'Analytics data not found',
        code: 'ANALYTICS_NOT_FOUND'
      });
    }

    // Get all posts for this integration (published, scheduled, draft)
    const topPosts = await Post.find({
      integrationId,
      userId
      // Removed status filter to get all posts
    })
    .sort({ 'metrics.likes': -1, publishedAt: -1 }) // Sort by likes and then by date
    .limit(50) // Increased limit to get more posts
    .select('content platform postId publishedAt metrics status scheduledAt');

    // Format the response
    const response = {
      accountId: integration._id,
      accountName: integration.username || integration.serviceName,
      platform: integration.platform,
      timeRange,
      metrics: analytics.metrics,
      topPosts: topPosts.map(post => ({
        id: post._id,
        platform: post.platform,
        content: post.content,
        date: post.publishedAt,
        likes: post.metrics?.likes || 0,
        comments: post.metrics?.comments || 0,
        shares: post.metrics?.shares || 0,
        mediaUrls: post.mediaUrls,
        status: post.status || 'published',  // Include status
        scheduledAt: post.scheduledAt        // Include scheduledAt for scheduled posts
      }))
    };

    res.json(response);
  }),

  // Get analytics overview for all integrations
  getAnalyticsOverview: handleAsync(async (req: AuthRequest, res: Response) => {
    const { timeRange = '30d' } = req.query;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }

    console.log('🔍 [Analytics] Fetching analytics overview');
    console.log('📝 [Query Params]:', {
      userId,
      timeRange
    });

    // Get all integrations for the user
    const integrations = await Integration.find({
      userId,
      serviceType: 'socialMedia',
      isConnected: true
    });

    if (integrations.length === 0) {
      return res.status(404).json({ 
        message: 'No connected integrations found',
        code: 'NO_INTEGRATIONS'
      });
    }

    // Get analytics for all integrations
    const integrationIds = integrations.map(integration => integration._id);
    
    const analyticsData = await Analytics.find({
      integrationId: { $in: integrationIds },
      userId,
      timeRange
    }).sort({ date: -1 });

    // Get all posts across all integrations (published, scheduled, draft)
    const topPosts = await Post.find({
      integrationId: { $in: integrationIds },
      userId
      // Removed status filter to get all posts
    })
    .sort({ 'metrics.likes': -1, publishedAt: -1 }) // Sort by likes and then by date
    .limit(50) // Increased limit to get more posts
    .select('content platform postId publishedAt metrics integrationId status scheduledAt');

    // Map integration IDs to their details
    const integrationMap = integrations.reduce((map, integration) => {
      map[integration._id.toString()] = {
        id: integration._id,
        name: integration.username || integration.serviceName,
        platform: integration.platform
      };
      return map;
    }, {} as Record<string, any>);

    // Aggregate metrics across all integrations
    const aggregatedMetrics = {
      posts: 0,
      likes: 0,
      followers: 0,
      engagements: 0,
      audienceGrowth: 0,
      audienceGrowthPercentage: 0,
      impressions: 0,
      reach: 0,
      shares: 0,
      comments: 0,
      clicks: 0,
      profileViews: 0
    };

    analyticsData.forEach(analytics => {
      Object.keys(aggregatedMetrics).forEach(key => {
        aggregatedMetrics[key as keyof typeof aggregatedMetrics] += 
          analytics.metrics[key as keyof typeof analytics.metrics] || 0;
      });
    });

    // Format the response
    const response = {
      timeRange,
      metrics: aggregatedMetrics,
      accounts: integrations.map(integration => ({
        id: integration._id,
        name: integration.username || integration.serviceName,
        platform: integration.platform,
        profileImage: integration.profileImageUrl || `/images/page2/${integration.platform}-icon.png`
      })),
      topPosts: topPosts.map(post => {
        const integration = integrationMap[post.integrationId.toString()];
        return {
          id: post._id,
          platform: post.platform,
          content: post.content,
          date: post.publishedAt,
          likes: post.metrics?.likes || 0,
          comments: post.metrics?.comments || 0,
          shares: post.metrics?.shares || 0,
          mediaUrls: post.mediaUrls,
          accountId: post.integrationId,
          accountName: integration ? integration.name : 'Unknown Account',
          status: post.status || 'published',  // Include status
          scheduledAt: post.scheduledAt        // Include scheduledAt for scheduled posts
        };
      })
    };

    res.json(response);
  })
};
