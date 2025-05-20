import mongoose from 'mongoose';
import { Integration } from '../models/Integration';
import { Post } from '../models/Post';
import { User } from '../models/User';

// MongoDB Atlas connection string from env-fix.txt
const MONGODB_URI = 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority&appName=marketing-automation';

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
 * Generate a random date between two dates
 */
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Generate dummy post content based on platform
 */
const generatePostContent = (platform: string, type: string) => {
  const hashtags = ['#marketingautomation', '#digitalmarketing', '#socialmedia', '#contentcreation', '#growthhacking'];
  const randomHashtags = hashtags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
  
  const baseContent = {
    twitter: 'Just launched our new marketing automation platform! Check it out and let us know what you think.',
    facebook: 'We\'re excited to announce the launch of our new marketing automation platform. It helps businesses streamline their marketing efforts and increase ROI. What features would you like to see?',
    instagram: 'New marketing automation platform just launched! Swipe to see all the amazing features. 🚀',
    linkedin: 'Proud to announce the launch of our new marketing automation platform designed to help businesses scale their marketing efforts efficiently. #ProductLaunch',
    pinterest: 'Marketing Automation Tips and Tricks | Learn how to automate your marketing workflows'
  };
  
  return `${baseContent[platform as keyof typeof baseContent]} ${randomHashtags.join(' ')}`;
};

/**
 * Generate random metrics for posts
 */
const generateMetrics = (platform: string, publishedDate: Date) => {
  const now = new Date();
  const daysSincePublished = Math.max(1, Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Base metrics vary by platform
  const baseMetrics = {
    twitter: { likes: 5, comments: 2, shares: 3 },
    facebook: { likes: 15, comments: 5, shares: 3 },
    instagram: { likes: 30, comments: 8, shares: 0 },
    linkedin: { likes: 20, comments: 3, shares: 5 },
    pinterest: { likes: 10, comments: 1, shares: 8 }
  };
  
  const base = baseMetrics[platform as keyof typeof baseMetrics] || { likes: 5, comments: 2, shares: 2 };
  
  // Randomize with some growth based on days since published
  return {
    likes: Math.floor(base.likes * (1 + Math.random() * 0.5) * Math.sqrt(daysSincePublished)),
    comments: Math.floor(base.comments * (1 + Math.random() * 0.5) * Math.sqrt(daysSincePublished)),
    shares: Math.floor(base.shares * (1 + Math.random() * 0.5) * Math.sqrt(daysSincePublished)),
    impressions: Math.floor(100 * (1 + Math.random() * 0.5) * daysSincePublished),
    reach: Math.floor(80 * (1 + Math.random() * 0.5) * daysSincePublished),
    engagement: Math.random() * 0.1 + 0.02, // 2-12% engagement rate
    lastUpdated: new Date()
  };
};

/**
 * Generate media URLs based on post type
 */
const generateMediaUrls = (type: string) => {
  const imageBaseUrl = 'https://via.placeholder.com/';
  const videoBaseUrl = 'https://example.com/videos/';
  
  switch (type) {
    case 'image':
      return [`${imageBaseUrl}1200x630?text=Marketing+Automation`];
    case 'video':
      return [`${videoBaseUrl}marketing-automation-demo.mp4`];
    case 'carousel':
      return [
        `${imageBaseUrl}1200x630?text=Feature+1`,
        `${imageBaseUrl}1200x630?text=Feature+2`,
        `${imageBaseUrl}1200x630?text=Feature+3`
      ];
    case 'link':
      return [`${imageBaseUrl}600x315?text=Link+Preview`];
    default:
      return [];
  }
};

/**
 * Generate platform-specific data
 */
const generatePlatformSpecific = (platform: string, type: string) => {
  switch (platform) {
    case 'twitter':
      return type === 'text' ? { isThreaded: Math.random() > 0.7 } : {};
    case 'facebook':
      return { privacy: Math.random() > 0.5 ? 'public' : 'friends' };
    case 'instagram':
      return type === 'carousel' ? { carouselId: `car_${Date.now()}` } : {};
    case 'linkedin':
      return { companyPage: Math.random() > 0.5 };
    default:
      return {};
  }
};

/**
 * Create posts for a specific integration
 */
const createPostsForIntegration = async (integration: any) => {
  // For non-social media integrations, assign a default platform
  let platform = integration.platform;
  if (!platform) {
    // For URL shorteners and other integrations, we'll create generic social media posts
    // and pretend they were shared via these services
    const platformMap: Record<string, string> = {
      'urlShortener': 'twitter', // Default platform for URL shorteners
      'analytics': 'facebook',
      'email': 'linkedin',
      'other': 'instagram'
    };
    platform = platformMap[integration.serviceType] || 'twitter';
  }
  
  const userId = integration.userId;
  
  // Generate between 3-7 posts for this integration
  const numPosts = Math.floor(Math.random() * 5) + 3;
  const posts = [];
  
  // Create published posts (70%)
  const publishedCount = Math.ceil(numPosts * 0.7);
  for (let i = 0; i < publishedCount; i++) {
    const postTypes = ['text', 'image', 'video', 'link', 'carousel'];
    const type = postTypes[Math.floor(Math.random() * postTypes.length)];
    const publishedAt = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
    
    posts.push({
      integrationId: integration._id,
      userId,
      platform,
      postId: `post_${Date.now()}_${i}`,
      content: generatePostContent(platform, type),
      mediaUrls: generateMediaUrls(type),
      type,
      status: 'published',
      publishedAt,
      metrics: generateMetrics(platform, publishedAt),
      platformSpecific: generatePlatformSpecific(platform, type),
      link: type === 'link' ? 'https://example.com/marketing-automation' : undefined,
      tags: ['marketing', 'automation', 'launch'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
      location: Math.random() > 0.7 ? {
        name: 'Marketing HQ',
        latitude: 37.7749,
        longitude: -122.4194
      } : undefined
    });
  }
  
  // Create scheduled posts (15%)
  const scheduledCount = Math.ceil(numPosts * 0.15);
  for (let i = 0; i < scheduledCount; i++) {
    const postTypes = ['text', 'image', 'link'];
    const type = postTypes[Math.floor(Math.random() * postTypes.length)];
    const scheduledAt = randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    
    posts.push({
      integrationId: integration._id,
      userId,
      platform,
      postId: `scheduled_${Date.now()}_${i}`,
      content: generatePostContent(platform, type),
      mediaUrls: generateMediaUrls(type),
      type,
      status: 'scheduled',
      scheduledAt,
      metrics: {
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        reach: 0,
        engagement: 0,
        lastUpdated: new Date()
      },
      platformSpecific: generatePlatformSpecific(platform, type),
      link: type === 'link' ? 'https://example.com/marketing-automation' : undefined,
      tags: ['marketing', 'automation', 'tips'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  // Create draft posts (30%)
  const draftCount = Math.ceil(numPosts * 0.3); // Increased to 30%
  const draftTemplates = [
    {
      content: '🚀 Exciting news! Our new feature launch is just around the corner. Stay tuned for a game-changing update that will revolutionize how you...',
      tags: ['productlaunch', 'comingsoon', 'innovation']
    },
    {
      content: '📊 Did you know? Our latest research shows that businesses using automation tools see a 40% increase in productivity. Here\'s how you can achieve the same results...',
      tags: ['research', 'productivity', 'automation']
    },
    {
      content: '🎯 Want to boost your social media engagement? Here are 5 proven strategies:\n\n1. Consistent posting schedule\n2. Engaging visuals\n3. Interactive content\n4. Community engagement\n5. Data-driven decisions',
      tags: ['socialmedia', 'marketing', 'tips']
    },
    {
      content: '🎉 We\'re thrilled to announce our upcoming webinar series! Join industry experts as they share insights on:\n\n📈 Growth strategies\n🤖 Automation best practices\n🎯 Target audience engagement\n\nSave your spot - link in bio!',
      tags: ['webinar', 'learning', 'growthhacking']
    },
    {
      content: '💡 Pro tip: The best time to post on [platform] is [time]. Schedule your content strategically to maximize reach and engagement. Here\'s what our data shows...',
      tags: ['socialmediatips', 'contentcreation', 'strategy']
    }
  ];

  for (let i = 0; i < draftCount; i++) {
    const postTypes = ['text', 'image', 'video', 'carousel', 'link'];
    const type = postTypes[Math.floor(Math.random() * postTypes.length)];
    const template = draftTemplates[Math.floor(Math.random() * draftTemplates.length)];
    
    posts.push({
      integrationId: integration._id,
      userId,
      platform,
      postId: `draft_${Date.now()}_${i}`,
      content: template.content.replace('[platform]', platform).replace('[time]', ['8 AM', '12 PM', '5 PM', '7 PM'][Math.floor(Math.random() * 4)]),
      mediaUrls: generateMediaUrls(type),
      type,
      status: 'draft',
      metrics: {
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        reach: 0,
        engagement: 0,
        lastUpdated: new Date()
      },
      platformSpecific: generatePlatformSpecific(platform, type),
      link: type === 'link' ? 'https://example.com/marketing-automation' : undefined,
      tags: template.tags
    });
  }
  
  try {
    await Post.insertMany(posts);
    return posts.length;
  } catch (error) {
    console.error(`Error creating posts for integration ${integration._id}:`, error);
    return 0;
  }
};

/**
 * Seed posts for all integrations
 */
const seedPosts = async () => {
  try {
    await connectDB();
    
    // First, clear any existing posts
    const deletedCount = await Post.deleteMany({});
    console.log(`🗑️ Deleted ${deletedCount.deletedCount} existing posts`);
    
    // Get all integrations
    const integrations = await Integration.find();
    
    if (integrations.length === 0) {
      console.log('⚠️ No integrations found in the database');
      process.exit(1);
    }
    
    console.log(`🔍 Found ${integrations.length} integrations`);
    
    // Create posts for each integration
    let totalPosts = 0;
    for (const integration of integrations) {
      const postsCreated = await createPostsForIntegration(integration);
      if (postsCreated > 0) {
        console.log(`✅ Created ${postsCreated} posts for integration: ${integration.serviceName} (${integration.platform || integration.serviceType})`);
        totalPosts += postsCreated;
      }
    }
    
    console.log(`\n✅ Successfully created ${totalPosts} posts`);
    
    // Display some stats
    const postsByStatus = await Post.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const postsByType = await Post.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    const postsByPlatform = await Post.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📊 Posts by status:');
    postsByStatus.forEach(status => {
      console.log(`   - ${status._id}: ${status.count}`);
    });
    
    console.log('\n📊 Posts by type:');
    postsByType.forEach(type => {
      console.log(`   - ${type._id}: ${type.count}`);
    });
    
    console.log('\n📊 Posts by platform:');
    postsByPlatform.forEach(platform => {
      console.log(`   - ${platform._id}: ${platform.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
};

// Run the script
seedPosts();
