import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Post, IPost } from '../models/Post';
import { Integration } from '../models/Integration';
import { User } from '../models/User';
import path from 'path';
import fs from 'fs';

// Load environment variables from env-fix.txt
const envFilePath = path.resolve(__dirname, '../../../env-fix.txt');
const envConfig = fs.readFileSync(envFilePath, 'utf-8')
  .split('\n')
  .filter(line => !line.startsWith('#') && line.includes('='))
  .reduce((acc: Record<string, string>, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

// Set MongoDB connection string from env-fix.txt
// Ensure there are no empty options in the connection string
const MONGODB_URI = 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority';

// Sample content for new posts
const sampleContents = [
  "Excited to announce our new product launch coming soon! Stay tuned for updates.",
  "Check out our latest blog post on digital marketing trends for 2025.",
  "We're hiring! Join our team of passionate professionals.",
  "Thank you to all our customers for your continued support.",
  "Happy holidays from our team to yours!",
  "Don't miss our upcoming webinar on social media strategy.",
  "New case study: How we helped a client increase conversions by 200%.",
  "Behind the scenes look at our team retreat last week.",
  "Tips for improving your social media engagement.",
  "Celebrating our 5th anniversary this month!"
];

// Sample media URLs
const sampleMediaUrls = [
  ["https://example.com/images/product-launch.jpg"],
  ["https://example.com/images/blog-cover.jpg"],
  ["https://example.com/images/team-photo.jpg"],
  [],
  ["https://example.com/images/holiday-greeting.jpg", "https://example.com/images/holiday-team.jpg"],
  ["https://example.com/images/webinar-promo.jpg"],
  [],
  ["https://example.com/images/retreat1.jpg", "https://example.com/images/retreat2.jpg", "https://example.com/images/retreat3.jpg"],
  ["https://example.com/images/social-tips.jpg"],
  ["https://example.com/images/anniversary.jpg"]
];

// Sample platforms
const platforms = ['twitter', 'facebook', 'linkedin', 'instagram'];

// Sample post types
const postTypes = ['text', 'image', 'video', 'link', 'carousel'];

// Function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to get a random date in the future (for scheduled posts)
const getRandomFutureDate = (): Date => {
  const now = new Date();
  // Random number of days in the future (1-30 days)
  const daysInFuture = Math.floor(Math.random() * 30) + 1;
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + daysInFuture);
  return futureDate;
};

// Main function to update post statuses and create new posts
async function updatePostStatuses() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // 1. Reset metrics for all scheduled and draft posts
    console.log('Resetting metrics for scheduled and draft posts...');
    const resetResult = await Post.updateMany(
      { status: { $in: ['scheduled', 'draft'] } },
      { 
        $set: { 
          'metrics.likes': 0,
          'metrics.comments': 0,
          'metrics.shares': 0,
          'metrics.impressions': 0,
          'metrics.reach': 0,
          'metrics.engagement': 0,
          'metrics.lastUpdated': new Date()
        } 
      }
    );
    console.log(`Reset metrics for ${resetResult.modifiedCount} posts`);

    // 2. Get a random user and their integrations to create new posts
    const randomUser = await User.findOne().sort({ createdAt: -1 });
    if (!randomUser) {
      throw new Error('No users found in the database');
    }

    const userIntegrations = await Integration.find({ userId: randomUser._id });
    if (userIntegrations.length === 0) {
      throw new Error('No integrations found for the selected user');
    }

    // 3. Create new scheduled posts
    console.log('Creating new scheduled posts...');
    const scheduledPostsToCreate = 5;
    const scheduledPosts = [];

    for (let i = 0; i < scheduledPostsToCreate; i++) {
      const integration = getRandomItem(userIntegrations);
      const content = getRandomItem(sampleContents);
      const mediaUrls = getRandomItem(sampleMediaUrls);
      const type = getRandomItem(postTypes);
      const scheduledAt = getRandomFutureDate();

      const newScheduledPost = new Post({
        integrationId: integration._id,
        userId: randomUser._id,
        platform: integration.platform,
        postId: `scheduled_${Date.now()}_${i}`,
        content,
        mediaUrls,
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
        tags: ['sample', 'scheduled']
      });

      scheduledPosts.push(newScheduledPost);
    }

    // 4. Create new draft posts
    console.log('Creating new draft posts...');
    const draftPostsToCreate = 5;
    const draftPosts = [];

    for (let i = 0; i < draftPostsToCreate; i++) {
      const integration = getRandomItem(userIntegrations);
      const content = getRandomItem(sampleContents);
      const mediaUrls = getRandomItem(sampleMediaUrls);
      const type = getRandomItem(postTypes);

      const newDraftPost = new Post({
        integrationId: integration._id,
        userId: randomUser._id,
        platform: integration.platform,
        postId: `draft_${Date.now()}_${i}`,
        content,
        mediaUrls,
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
        tags: ['sample', 'draft']
      });

      draftPosts.push(newDraftPost);
    }

    // Save all new posts
    const allNewPosts = [...scheduledPosts, ...draftPosts];
    await Post.insertMany(allNewPosts);

    console.log(`Created ${scheduledPostsToCreate} scheduled posts and ${draftPostsToCreate} draft posts`);
    console.log('Script completed successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the main function
updatePostStatuses();
