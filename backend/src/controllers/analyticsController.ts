import { Request, Response } from 'express';
import { Analytics } from '../models/Analytics';
import { Integration } from '../models/Integration';
import { Post } from '../models/Post';
import { handleAsync } from '../utils/handleAsync';

// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
}

// Helper functions
const getPlatformIcon = (platform: string): string => {
  switch (platform?.toLowerCase()) {
    case 'twitter': return '/images/page3/twitter@3x.png';
    case 'facebook': return '/images/page3/facebook@3x.png';
    case 'instagram': return '/images/page3/instagram@3x.png';
    case 'linkedin': return '/images/page3/linkedin@3x.png';
    case 'pinterest': return '/images/page3/pinterest-seeklogo-com@3x.png';
    default: return '/images/page3/twitter@3x.png';
  }
};

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

const convertTimeFilterToRange = (timeFilter: string): string => {
  switch (timeFilter) {
    case 'Today': return '1d';
    case 'This Week': return '7d';
    case 'This Month': return '30d';
    case 'Custom': return '30d'; // Default to 30d for custom range
    default: return '30d';
  }
};

const formatMetricsForDashboard = (analytics: any, platform: string, timeFilter: string): any[] => {
  // Determine change label based on time filter
  let changeLabel = '';
  switch (timeFilter) {
    case 'Today': changeLabel = 'today';
      break;
    case 'This Week': changeLabel = 'this week';
      break;
    case 'This Month': changeLabel = 'vs previous month';
      break;
    case 'Custom': changeLabel = 'in selected period';
      break;
    default: changeLabel = 'vs previous period';
  }

  // Format metrics based on platform
  const metrics = [];
  
  if (platform === 'twitter') {
    metrics.push(
      { 
        label: 'Total Followers', 
        value: formatMetricValue(analytics.metrics.followers), 
        change: `+${analytics.metrics.audienceGrowthPercentage.toFixed(1)}%`, 
        changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Tweets', 
        value: analytics.metrics.posts.toString(), 
        change: `+${analytics.metrics.posts}`, 
        changeLabel: 'new ' + changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Queued Posts', 
        value: '0', // This would need to be fetched separately
        change: '0', 
        changeLabel: 'from previous period', 
        isPositive: true 
      },
      { 
        label: 'Engagements', 
        value: formatMetricValue(analytics.metrics.engagements), 
        change: '+15%', // This would need to be calculated
        changeLabel, 
        isPositive: true 
      }
    );
  } else if (platform === 'facebook') {
    metrics.push(
      { 
        label: 'Total Followers', 
        value: formatMetricValue(analytics.metrics.followers), 
        change: `+${analytics.metrics.audienceGrowthPercentage.toFixed(1)}%`, 
        changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Posts', 
        value: analytics.metrics.posts.toString(), 
        change: `+${analytics.metrics.posts}`, 
        changeLabel: 'new ' + changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Queued Posts', 
        value: '0', // This would need to be fetched separately
        change: '0', 
        changeLabel: 'from previous period', 
        isPositive: true 
      },
      { 
        label: 'Engagements', 
        value: formatMetricValue(analytics.metrics.engagements), 
        change: '+8%', // This would need to be calculated
        changeLabel, 
        isPositive: true 
      }
    );
  } else if (platform === 'linkedin') {
    metrics.push(
      { 
        label: 'Connections', 
        value: formatMetricValue(analytics.metrics.followers), 
        change: `+${analytics.metrics.audienceGrowthPercentage.toFixed(1)}%`, 
        changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Posts', 
        value: analytics.metrics.posts.toString(), 
        change: `+${analytics.metrics.posts}`, 
        changeLabel: 'new ' + changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Queued Posts', 
        value: '0', // This would need to be fetched separately
        change: '0', 
        changeLabel: 'from previous period', 
        isPositive: true 
      },
      { 
        label: 'Engagements', 
        value: formatMetricValue(analytics.metrics.engagements), 
        change: '+12%', // This would need to be calculated
        changeLabel, 
        isPositive: true 
      }
    );
  } else if (platform === 'pinterest') {
    metrics.push(
      { 
        label: 'Followers', 
        value: formatMetricValue(analytics.metrics.followers), 
        change: `+${analytics.metrics.audienceGrowthPercentage.toFixed(1)}%`, 
        changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Pins', 
        value: analytics.metrics.posts.toString(), 
        change: `+${analytics.metrics.posts}`, 
        changeLabel: 'new ' + changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Queued Pins', 
        value: '0', // This would need to be fetched separately
        change: '0', 
        changeLabel: 'from previous period', 
        isPositive: true 
      },
      { 
        label: 'Engagements', 
        value: formatMetricValue(analytics.metrics.engagements), 
        change: '+22%', // This would need to be calculated
        changeLabel, 
        isPositive: true 
      }
    );
  } else {
    // Default metrics for other platforms
    metrics.push(
      { 
        label: 'Total Followers', 
        value: formatMetricValue(analytics.metrics.followers), 
        change: `+${analytics.metrics.audienceGrowthPercentage.toFixed(1)}%`, 
        changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Posts', 
        value: analytics.metrics.posts.toString(), 
        change: `+${analytics.metrics.posts}`, 
        changeLabel: 'new ' + changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Engagements', 
        value: formatMetricValue(analytics.metrics.engagements), 
        change: '+10%', // This would need to be calculated
        changeLabel, 
        isPositive: true 
      },
      { 
        label: 'Reach', 
        value: formatMetricValue(analytics.metrics.reach), 
        change: '+5%', // This would need to be calculated
        changeLabel, 
        isPositive: true 
      }
    );
  }
  
  return metrics;
};

const formatMetricValue = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  } else {
    return value.toString();
  }
};

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

  // Get dashboard data for channel analytics, recent posts, and upcoming posts
  getDashboardData: handleAsync(async (req: AuthRequest, res: Response) => {
    const { timeFilter = 'This Month' } = req.query;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }

    try {
      // 1. Get all integrations for the user
      const integrations = await Integration.find({
        userId,
        serviceType: 'socialMedia',
        status: 'active'
      }).select('platform username displayName profileImageUrl metadata');

      if (!integrations || integrations.length === 0) {
        return res.status(200).json({
          accounts: [],
          recentPosts: [],
          upcomingPosts: []
        });
      }

      // 2. Format integrations as social accounts
      const accounts = integrations.map(integration => ({
        id: integration._id,
        name: integration.displayName || integration.username || '',
        handle: '@' + (integration.username || ''),
        platform: integration.platform || '',
        platformIcon: getPlatformIcon(integration.platform || ''),
        profileImage: integration.profileImageUrl || '/images/page2/user.png'
      }));

      // 3. Get recent published posts
      const publishedPosts = await Post.find({
        userId,
        status: 'published'
      })
      .sort({ publishedAt: -1 })
      .limit(5)
      .populate('integrationId', 'platform username displayName profileImageUrl');

      // 4. Get upcoming scheduled posts
      console.log('Fetching scheduled posts for userId:', userId);
      console.log('Current date used for comparison:', new Date());
      
      // First check if any scheduled posts exist without the date filter
      const allScheduledPosts = await Post.find({
        userId,
        status: 'scheduled'
      });
      console.log('Total scheduled posts (without date filter):', allScheduledPosts.length);
      if (allScheduledPosts.length > 0) {
        const samplePost = allScheduledPosts[0];
        console.log('Sample scheduled post:', {
          id: samplePost._id,
          status: samplePost.status,
          scheduledAt: samplePost.scheduledAt,
          isPastDate: samplePost.scheduledAt ? samplePost.scheduledAt < new Date() : 'unknown'
        });
      }
      
      // Now get the filtered scheduled posts - using a more lenient approach to ensure we get posts
      // First, try without the date filter if we have no results with it
      let scheduledPosts = await Post.find({
        userId,
        status: 'scheduled',
        scheduledAt: { $gt: new Date() }
      })
      .sort({ scheduledAt: 1 })
      .limit(5)
      .populate('integrationId', 'platform username displayName profileImageUrl');
      
      console.log('Filtered scheduled posts count (future dates only):', scheduledPosts.length);
      
      // If no posts found with future dates, try getting any scheduled posts
      if (scheduledPosts.length === 0 && allScheduledPosts.length > 0) {
        console.log('No future scheduled posts found, but there are scheduled posts. Getting all scheduled posts instead.');
        scheduledPosts = await Post.find({
          userId,
          status: 'scheduled'
        })
        .sort({ scheduledAt: 1 })
        .limit(5)
        .populate('integrationId', 'platform username displayName profileImageUrl');
        
        console.log('All scheduled posts count (including past dates):', scheduledPosts.length);
      }

      // 5. Format posts for the frontend
      const recentPosts = publishedPosts.map(post => {
        const integration = post.integrationId as any;
        return {
          id: post._id,
          company: integration.displayName || integration.username || '',
          companyHandle: '@' + (integration.username || ''),
          companyIcon: integration.profileImageUrl || '/images/page2/user.png',
          date: formatDate(post.publishedAt),
          platform: integration.platform,
          platformIcon: getPlatformIcon(integration.platform),
          content: post.content,
          stats: {
            retweets: post.metrics?.shares || 0,
            likes: post.metrics?.likes || 0,
            comments: post.metrics?.comments || 0,
            views: post.metrics?.impressions || 0,
            shares: post.metrics?.shares || 0
          }
        };
      });

      const upcomingPosts = scheduledPosts.map(post => {
        const integration = post.integrationId as any;
        return {
          id: post._id,
          company: integration.displayName || integration.username || '',
          companyHandle: '@' + (integration.username || ''),
          companyIcon: integration.profileImageUrl || '/images/page2/user.png',
          date: formatDate(post.scheduledAt || new Date()),
          platform: integration.platform,
          platformIcon: getPlatformIcon(integration.platform),
          content: post.content
        };
      });

      // 6. Return the dashboard data
      res.json({
        accounts,
        recentPosts,
        upcomingPosts
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ 
        message: 'Failed to fetch dashboard data',
        error: error.message || 'Unknown error'
      });
    }
  }),

  // Get channel analytics data for a specific account
  getChannelAnalytics: handleAsync(async (req: AuthRequest, res: Response) => {
    const { accountId, timeFilter = 'This Month' } = req.query;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }

    try {
      // Convert UI time filter to API time range
      const timeRange = convertTimeFilterToRange(timeFilter as string);

      // Get the integration
      const integration = await Integration.findOne({
        _id: accountId,
        userId
      });

      if (!integration) {
        return res.status(404).json({ 
          message: 'Account not found',
          code: 'ACCOUNT_NOT_FOUND'
        });
      }

      // Get analytics data
      const analytics = await Analytics.findOne({
        integrationId: accountId,
        userId,
        timeRange
      }).sort({ date: -1 }); // Get the most recent analytics

      if (!analytics) {
        return res.status(404).json({ 
          message: 'Analytics data not found',
          code: 'ANALYTICS_NOT_FOUND'
        });
      }

      // Format metrics for the dashboard
      const metrics = formatMetricsForDashboard(analytics, integration.platform || '', timeFilter as string);

      // Return the channel analytics data
      res.json({
        accountId: integration._id,
        accountName: integration.displayName || integration.username,
        platform: integration.platform,
        timeRange,
        metrics
      });
    } catch (error: any) {
      console.error('Error fetching channel analytics:', error);
      res.status(500).json({ 
        message: 'Failed to fetch channel analytics',
        error: error.message || 'Unknown error'
      });
    }
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
