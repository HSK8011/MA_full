import mongoose from 'mongoose';
import { Post } from '../models/Post';

// Direct MongoDB connection string
const MONGODB_URI = 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority';

/**
 * Script to ensure all draft and scheduled posts have zero metrics
 * and to add status field to any posts that might be missing it
 */
async function fixPostStatuses() {
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
    console.log(`Reset metrics for ${resetResult.modifiedCount} posts with scheduled/draft status`);

    // 2. Ensure all posts have a status field (set to 'published' if missing)
    console.log('Checking for posts without status field...');
    const statusFixResult = await Post.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'published' } }
    );
    console.log(`Added status field to ${statusFixResult.modifiedCount} posts`);

    // 3. Print summary of posts by status
    const statusCounts = await Post.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    console.log('Post status summary:');
    statusCounts.forEach(status => {
      console.log(`- ${status._id}: ${status.count} posts`);
    });

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
fixPostStatuses();
