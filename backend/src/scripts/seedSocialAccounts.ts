import mongoose from 'mongoose';
import { Integration } from '../models/Integration';
import { Post } from '../models/Post';

// MongoDB Atlas connection string from env-fix.txt
const MONGODB_URI = 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority&appName=marketing-automation';

// User ID to create integrations for
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
 * Social media integrations to create
 */
const SOCIAL_INTEGRATIONS = [
  {
    serviceId: 'twitter-profile',
    serviceName: 'Twitter Profile',
    serviceType: 'socialMedia',
    platform: 'twitter',
    username: 'marketing_auto',
    displayName: 'Marketing Automation',
    profileImageUrl: 'https://via.placeholder.com/150?text=Twitter',
    isConnected: true,
    status: 'active',
    settings: { autoPost: true, scheduleEnabled: true },
    credentials: { 
      apiKey: 'DUMMY_API_KEY_FOR_DEVELOPMENT_ONLY',
      apiSecret: 'DUMMY_API_SECRET_FOR_DEVELOPMENT_ONLY',
      accessToken: 'DUMMY_ACCESS_TOKEN_FOR_DEVELOPMENT_ONLY',
      accessTokenSecret: 'DUMMY_ACCESS_TOKEN_SECRET_FOR_DEVELOPMENT_ONLY'
    },
    metadata: {
      icon: '/images/twitter-logo.png',
      accountType: 'personal',
      scopes: ['tweet.read', 'tweet.write', 'users.read']
    },
    lastConnectedAt: new Date()
  },
  {
    serviceId: 'instagram-profile',
    serviceName: 'Instagram Profile',
    serviceType: 'socialMedia',
    platform: 'instagram',
    username: 'marketingautomation',
    displayName: 'Marketing Automation',
    profileImageUrl: 'https://via.placeholder.com/150?text=Instagram',
    isConnected: true,
    status: 'active',
    settings: { autoPost: true, scheduleEnabled: true },
    credentials: { accessToken: 'DUMMY_TOKEN_FOR_DEVELOPMENT_ONLY' },
    metadata: {
      icon: '/images/instagram-logo.png',
      accountType: 'creator',
      scopes: ['instagram_basic', 'instagram_content_publish']
    },
    lastConnectedAt: new Date()
  },
  {
    serviceId: 'facebook-page',
    serviceName: 'Facebook Page',
    serviceType: 'socialMedia',
    platform: 'facebook',
    username: 'marketingpage',
    displayName: 'Marketing Automation Page',
    profileImageUrl: 'https://via.placeholder.com/150?text=Facebook',
    isConnected: true,
    status: 'active',
    settings: { autoPost: true, scheduleEnabled: true },
    credentials: { pageAccessToken: 'DUMMY_TOKEN_FOR_DEVELOPMENT_ONLY' },
    metadata: {
      icon: '/images/facebook-logo.png',
      pageId: '123456789012345',
      accountType: 'business',
      scopes: ['pages_manage_posts', 'pages_read_engagement']
    },
    lastConnectedAt: new Date()
  },
  {
    serviceId: 'pinterest-account',
    serviceName: 'Pinterest Account',
    serviceType: 'socialMedia',
    platform: 'pinterest',
    username: 'marketingauto',
    displayName: 'Marketing Automation',
    profileImageUrl: 'https://via.placeholder.com/150?text=Pinterest',
    isConnected: true,
    status: 'active',
    settings: { autoPost: true, scheduleEnabled: true },
    credentials: { accessToken: 'DUMMY_TOKEN_FOR_DEVELOPMENT_ONLY' },
    metadata: {
      icon: '/images/pinterest-logo.png',
      accountType: 'business',
      scopes: ['boards:read', 'pins:read', 'pins:write']
    },
    lastConnectedAt: new Date()
  },
  {
    serviceId: 'linkedin-profile',
    serviceName: 'LinkedIn Profile',
    serviceType: 'socialMedia',
    platform: 'linkedin',
    username: 'marketing-automation',
    displayName: 'Marketing Automation',
    profileImageUrl: 'https://via.placeholder.com/150?text=LinkedIn',
    isConnected: true,
    status: 'active',
    settings: { autoPost: true, scheduleEnabled: true },
    credentials: { accessToken: 'DUMMY_TOKEN_FOR_DEVELOPMENT_ONLY' },
    metadata: {
      icon: '/images/linkedin-logo.png',
      accountType: 'personal',
      scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
    },
    lastConnectedAt: new Date()
  }
];

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
  
  return `${baseContent[platform as keyof typeof baseContent] || baseContent.twitter} ${randomHashtags.join(' ')}`;
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
const generateMediaUrls = (type: string, platform: string) => {
  const imageBaseUrl = 'https://via.placeholder.com/';
  const videoBaseUrl = 'https://example.com/videos/';
  
  // Ensure platform is defined
  const safePlatform = platform || 'generic';
  
  switch (type) {
    case 'image':
      return [`${imageBaseUrl}1200x630?text=${safePlatform}+Post`];
    case 'video':
      return [`${videoBaseUrl}${safePlatform.toLowerCase()}-demo.mp4`];
    case 'carousel':
      return [
        `${imageBaseUrl}1200x630?text=${safePlatform}+Feature+1`,
        `${imageBaseUrl}1200x630?text=${safePlatform}+Feature+2`,
        `${imageBaseUrl}1200x630?text=${safePlatform}+Feature+3`
      ];
    case 'link':
      return [`${imageBaseUrl}600x315?text=${safePlatform}+Link+Preview`];
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
    case 'pinterest':
      return { boardName: 'Marketing Tips' };

    default:
      return {};
  }
};

/**
 * Create posts for a specific integration
 */
const createPostsForIntegration = async (integration: any) => {
  const platform = integration.platform;
  const userId = new mongoose.Types.ObjectId(USER_ID);
  
  // Generate between 5-10 posts for this integration
  const numPosts = Math.floor(Math.random() * 6) + 5;
  const posts = [];
  
  // Create published posts (60%)
  const publishedCount = Math.ceil(numPosts * 0.6);
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
      mediaUrls: generateMediaUrls(type, platform),
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
  
  // Create scheduled posts (25%)
  const scheduledCount = Math.ceil(numPosts * 0.25);
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
      mediaUrls: generateMediaUrls(type, platform),
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
  
  // Create draft posts (15%)
  const draftCount = numPosts - publishedCount - scheduledCount;
  for (let i = 0; i < draftCount; i++) {
    const postTypes = ['text', 'image'];
    const type = postTypes[Math.floor(Math.random() * postTypes.length)];
    
    posts.push({
      integrationId: integration._id,
      userId,
      platform,
      postId: `draft_${Date.now()}_${i}`,
      content: `Draft post about our upcoming ${platform} campaign...`,
      mediaUrls: type === 'image' ? generateMediaUrls('image', platform) : [],
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
      platformSpecific: {},
      tags: ['draft', 'upcoming']
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
 * Seed integrations and posts
 */
const seedIntegrationsAndPosts = async () => {
  try {
    await connectDB();
    
    // Clear existing integrations and posts
    await Integration.deleteMany({});
    console.log('🗑️ Deleted all existing integrations');
    
    await Post.deleteMany({});
    console.log('🗑️ Deleted all existing posts');
    
    // Create new integrations for the specified user
    const userId = new mongoose.Types.ObjectId(USER_ID);
    const integrationsToCreate = SOCIAL_INTEGRATIONS.map(integration => ({
      ...integration,
      userId
    }));
    
    const createdIntegrations = await Integration.insertMany(integrationsToCreate);
    console.log(`✅ Created ${createdIntegrations.length} social media integrations for user ${USER_ID}`);
    
    // Create posts for each integration
    let totalPosts = 0;
    for (const integration of createdIntegrations) {
      const postsCreated = await createPostsForIntegration(integration);
      console.log(`✅ Created ${postsCreated} posts for ${integration.serviceName} (${integration.platform})`);
      totalPosts += postsCreated;
    }
    
    console.log(`\n✅ Successfully created ${totalPosts} posts across all integrations`);
    
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
    console.error('Error seeding integrations and posts:', error);
    process.exit(1);
  }
};

// Run the script
seedIntegrationsAndPosts();
