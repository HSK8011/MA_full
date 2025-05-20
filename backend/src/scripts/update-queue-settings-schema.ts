/**
 * Script to update QueueSetting schema with defaultContent field
 * 
 * This script updates all existing QueueSetting documents to include the defaultContent field
 * and adds some sample default content templates for different platforms.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { QueueSetting, IQueueSetting } from '../models/QueueSetting';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/story';

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('Using MongoDB URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Update QueueSetting schema
const updateQueueSettingSchema = async (): Promise<void> => {
  try {
    // Find all queue settings
    const queueSettings = await QueueSetting.find({});
    console.log(`Found ${queueSettings.length} queue settings to update`);

    // Update each queue setting with default content if it doesn't already have it
    for (const queueSetting of queueSettings) {
      if (!queueSetting.defaultContent) {
        queueSetting.defaultContent = {
          hashtags: ['#story', '#socialmedia', '#marketing'],
          mentions: ['@story'],
          templates: {
            twitter: "Check out our latest update! {{link}}",
            facebook: "We have some exciting news to share! {{link}}",
            linkedin: "We're excited to announce our latest feature. Read more at {{link}}",
            instagram: "New post alert! 📱 {{link}}"
          }
        };
        
        await queueSetting.save();
        console.log(`Updated queue setting for user ${queueSetting.userId} and account ${queueSetting.accountId}`);
      } else {
        console.log(`Queue setting for user ${queueSetting.userId} and account ${queueSetting.accountId} already has defaultContent`);
      }
    }

    // If no queue settings were found, create a sample one
    if (queueSettings.length === 0) {
      console.log('No queue settings found. Creating a sample queue setting...');
      
      const sampleQueueSetting = new QueueSetting({
        userId: new mongoose.Types.ObjectId(),
        accountId: 'sample-account',
        weekdaySettings: [
          {
            day: 'monday',
            enabled: true,
            timeSlots: [{ time: '09:00' }, { time: '17:00' }]
          },
          {
            day: 'wednesday',
            enabled: true,
            timeSlots: [{ time: '10:00' }, { time: '15:00' }]
          },
          {
            day: 'friday',
            enabled: true,
            timeSlots: [{ time: '11:00' }, { time: '16:00' }]
          }
        ],
        defaultContent: {
          hashtags: ['#story', '#socialmedia', '#marketing'],
          mentions: ['@story'],
          templates: {
            twitter: "Check out our latest update! {{link}}",
            facebook: "We have some exciting news to share! {{link}}",
            linkedin: "We're excited to announce our latest feature. Read more at {{link}}",
            instagram: "New post alert! 📱 {{link}}"
          }
        }
      });
      
      await sampleQueueSetting.save();
      console.log('Sample queue setting created successfully');
    }

    console.log('✅ QueueSetting schema update completed successfully');
  } catch (error) {
    console.error('❌ Error updating QueueSetting schema:', error);
  }
};

// Main function
const main = async (): Promise<void> => {
  try {
    await connectDB();
    await updateQueueSettingSchema();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in main function:', error);
    process.exit(1);
  }
};

// Run the script
main();
