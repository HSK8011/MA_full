import mongoose from 'mongoose';
import { Integration } from '../models/Integration';
import connectDB from '../config/database';
import { config } from '../config';
import { User } from '../models/User';

export const DEFAULT_INTEGRATIONS = [
  {
    serviceId: 'bitly',
    serviceName: 'Bitly',
    serviceType: 'urlShortener',
    isConnected: false,
    metadata: {
      icon: '/images/bitly-logo.png',
      description: 'Shorten, create and share trusted links',
      website: 'https://bitly.com',
      apiDocumentation: 'https://dev.bitly.com/'
    }
  },
  {
    serviceId: 'rebrandly',
    serviceName: 'Rebrandly',
    serviceType: 'urlShortener',
    isConnected: false,
    metadata: {
      icon: '/images/rebrandly-logo.png',
      description: 'Custom branded domain URL shortener',
      website: 'https://www.rebrandly.com',
      apiDocumentation: 'https://developers.rebrandly.com/'
    }
  },
  {
    serviceId: 'tinyurl',
    serviceName: 'TinyURL',
    serviceType: 'urlShortener',
    isConnected: false,
    metadata: {
      icon: '/images/tinyurl-logo.png',
      description: 'Easy-to-use URL shortening service',
      website: 'https://tinyurl.com',
      apiDocumentation: 'https://tinyurl.com/app/dev'
    }
  }
];

/**
 * Create default integrations for a new user
 * @param userId - MongoDB ObjectId of the user
 */
export const createDefaultIntegrations = async (userId: mongoose.Types.ObjectId) => {
  try {
    const integrationsToCreate = DEFAULT_INTEGRATIONS.map(integration => ({
      userId,
      ...integration,
      credentials: {},
    }));
    
    // Use insertMany for better performance
    await Integration.insertMany(integrationsToCreate);
    console.log(`✅ Created default integrations for user ${userId}`);
    
  } catch (error) {
    console.error('Error creating default integrations:', error);
    throw error;
  }
};







/**
 * Run this script directly to seed all integrations
 * This is for development/testing purposes only
 */
const seedAllIntegrations = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('⛔ This script should not be run in production');
    process.exit(1);
  }
  
  try {
    await connectDB();
    
    // Get the first user from the database if no user ID is provided
    const user = await User.findOne();
    const testUserId = process.argv[2] || user?._id;
    
    if (!testUserId) {
      throw new Error('No user found in the database');
    }
    
    const userId = new mongoose.Types.ObjectId(testUserId);
    
    // Delete existing integrations for this user
    await Integration.deleteMany({ userId });
    console.log(`🗑️ Deleted existing integrations for user ${userId}`);
    
    // Create new default integrations
    await createDefaultIntegrations(userId);
    
    console.log('✅ Successfully seeded integrations');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding integrations:', error);
    process.exit(1);
  }
};

// Run the script if called directly (not imported)
if (require.main === module) {
  seedAllIntegrations();
} 