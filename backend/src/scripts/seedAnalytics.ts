import mongoose from 'mongoose';
import { Integration } from '../models/Integration';
import { Analytics } from '../models/Analytics';
import { Post } from '../models/Post';

// MongoDB Atlas connection string from env-fix.txt
const MONGODB_URI = 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority&appName=marketing-automation';

// User ID to create analytics for
const USER_ID = '68248478e90c40aa4a290bc6';

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Generate random analytics data for an integration
 */
const generateAnalyticsData = (integration: any, timeRange: string) => {
  const platform = integration.platform;
  
  // Base metrics vary by platform
  const baseMetrics: Record<string, Record<string, number>> = {
    twitter: { 
      posts: 120,
      likes: 2500,
      followers: 5000,
      engagements: 8500,
      audienceGrowth: 150,
      audienceGrowthPercentage: 3,
      impressions: 25000,
      reach: 18000,
      shares: 450,
      comments: 350,
      clicks: 1200,
      profileViews: 800
    },
    facebook: { 
      posts: 80,
      likes: 4500,
      followers: 8000,
      engagements: 12000,
      audienceGrowth: 200,
      audienceGrowthPercentage: 2.5,
      impressions: 35000,
      reach: 28000,
      shares: 850,
      comments: 750,
      clicks: 1800,
      profileViews: 1200
    },
    instagram: { 
      posts: 60,
      likes: 8000,
      followers: 12000,
      engagements: 15000,
      audienceGrowth: 300,
      audienceGrowthPercentage: 2.5,
      impressions: 45000,
      reach: 38000,
      shares: 200,
      comments: 1200,
      clicks: 900,
      profileViews: 2500
    },
    linkedin: { 
      posts: 40,
      likes: 1800,
      followers: 3500,
      engagements: 5000,
      audienceGrowth: 120,
      audienceGrowthPercentage: 3.4,
      impressions: 15000,
      reach: 12000,
      shares: 350,
      comments: 250,
      clicks: 800,
      profileViews: 600
    },
    pinterest: { 
      posts: 90,
      likes: 3500,
      followers: 6000,
      engagements: 7500,
      audienceGrowth: 180,
      audienceGrowthPercentage: 3,
      impressions: 30000,
      reach: 25000,
      shares: 1200,
      comments: 300,
      clicks: 2500,
      profileViews: 900
    }
  };
  
  // Get base metrics for the platform or use twitter as default
  const base = baseMetrics[platform] || baseMetrics.twitter;
  
  // Adjust metrics based on time range
  const timeRangeMultiplier: Record<string, number> = {
    '7d': 0.25,
    '30d': 1,
    '90d': 3,
    '1y': 12
  };
  
  const multiplier = timeRangeMultiplier[timeRange];
  
  // Apply some randomness to the metrics
  const randomizedMetrics: Record<string, number> = {};
  
  Object.keys(base).forEach(key => {
    const baseValue = base[key];
    // Apply time range multiplier and add some randomness (±20%)
    const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
    randomizedMetrics[key] = Math.round(baseValue * multiplier * randomFactor);
  });
  
  return {
    integrationId: integration._id,
    userId: new mongoose.Types.ObjectId(USER_ID),
    platform,
    timeRange,
    date: new Date(),
    metrics: randomizedMetrics
  };
};

/**
 * Seed analytics data for integrations
 */
const seedAnalytics = async () => {
  try {
    await connectDB();
    
    // Clear existing analytics
    await Analytics.deleteMany({});
    console.log('🗑️ Deleted all existing analytics');
    
    // Get all integrations for the user
    const integrations = await Integration.find({
      userId: USER_ID,
      serviceType: 'socialMedia'
    });
    
    if (integrations.length === 0) {
      console.log('⚠️ No social media integrations found for user', USER_ID);
      process.exit(1);
    }
    
    console.log(`🔍 Found ${integrations.length} social media integrations`);
    
    // Create analytics data for each integration and time range
    const timeRanges = ['7d', '30d', '90d', '1y'];
    const analyticsToCreate = [];
    
    for (const integration of integrations) {
      for (const timeRange of timeRanges) {
        analyticsToCreate.push(generateAnalyticsData(integration, timeRange));
      }
    }
    
    // Insert analytics data
    await Analytics.insertMany(analyticsToCreate);
    console.log(`✅ Created ${analyticsToCreate.length} analytics records`);
    
    // Update post metrics to match analytics data
    const posts = await Post.find({
      userId: USER_ID
    });
    
    if (posts.length > 0) {
      console.log(`📊 Updating metrics for ${posts.length} posts`);
      
      const updatePromises = posts.map(post => {
        // Generate random metrics for the post
        const likes = Math.floor(Math.random() * 200) + 10;
        const comments = Math.floor(Math.random() * 50) + 5;
        const shares = Math.floor(Math.random() * 30) + 2;
        const impressions = likes * (Math.floor(Math.random() * 10) + 5);
        const reach = impressions * 0.8;
        
        return Post.updateOne(
          { _id: post._id },
          { 
            $set: { 
              'metrics.likes': likes,
              'metrics.comments': comments,
              'metrics.shares': shares,
              'metrics.impressions': impressions,
              'metrics.reach': reach,
              'metrics.engagement': (likes + comments + shares) / impressions
            } 
          }
        );
      });
      
      await Promise.all(updatePromises);
      console.log('✅ Updated post metrics');
    }
    
    console.log('\n✅ Successfully seeded analytics data');
    
    // Display some stats
    const analyticsCount = await Analytics.countDocuments();
    const analyticsPerPlatform = await Analytics.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);
    
    console.log(`\n📊 Total analytics records: ${analyticsCount}`);
    console.log('📊 Analytics by platform:');
    analyticsPerPlatform.forEach(platform => {
      console.log(`   - ${platform._id}: ${platform.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding analytics:', error);
    process.exit(1);
  }
};

// Run the script
seedAnalytics();
