import mongoose from 'mongoose';
import { Post } from '../models/Post';

// Direct MongoDB connection string without any empty parameters
const MONGODB_URI = 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority';

/**
 * Script to reset metrics for all draft and scheduled posts
 * This ensures that posts that haven't been published yet don't show any engagement metrics
 */
async function resetDraftAndScheduledPostMetrics() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Reset metrics for all scheduled and draft posts
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
resetDraftAndScheduledPostMetrics();
