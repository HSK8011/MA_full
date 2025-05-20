import mongoose from 'mongoose';
import { config } from '../config';
import { Integration } from '../models/Integration';
import connectDB from '../config/database';

const dummyIntegrations = [
  {
    serviceId: 'twitter-1',
    serviceName: 'Twitter',
    serviceType: 'socialMedia',
    platform: 'twitter',
    username: 'marketingpro',
    displayName: 'Marketing Pro',
    profileImageUrl: 'https://placekitten.com/100/100',
    isConnected: true,
    status: 'active',
    metadata: {
      icon: 'twitter-icon.png',
      description: 'Twitter Business Account',
      accountType: 'business',
      scopes: ['tweet.read', 'tweet.write', 'users.read']
    }
  },
  {
    serviceId: 'facebook-1',
    serviceName: 'Facebook',
    serviceType: 'socialMedia',
    platform: 'facebook',
    username: 'marketingagency',
    displayName: 'Marketing Agency',
    profileImageUrl: 'https://placekitten.com/101/101',
    isConnected: true,
    status: 'active',
    metadata: {
      icon: 'facebook-icon.png',
      description: 'Facebook Business Page',
      pageId: '123456789',
      accountType: 'business',
      scopes: ['pages_manage_posts', 'pages_read_engagement']
    }
  },
  {
    serviceId: 'linkedin-1',
    serviceName: 'LinkedIn',
    serviceType: 'socialMedia',
    platform: 'linkedin',
    username: 'marketing-solutions',
    displayName: 'Marketing Solutions',
    profileImageUrl: 'https://placekitten.com/102/102',
    isConnected: false,
    status: 'error',
    metadata: {
      icon: 'linkedin-icon.png',
      description: 'LinkedIn Company Page',
      accountType: 'business',
      scopes: ['w_member_social', 'r_organization_social']
    }
  },
  {
    serviceId: 'instagram-1',
    serviceName: 'Instagram',
    serviceType: 'socialMedia',
    platform: 'instagram',
    username: 'marketingcreative',
    displayName: 'Marketing Creative',
    profileImageUrl: 'https://placekitten.com/103/103',
    isConnected: true,
    status: 'active',
    metadata: {
      icon: 'instagram-icon.png',
      description: 'Instagram Creator Account',
      accountType: 'creator',
      scopes: ['basic', 'comments', 'relationships']
    }
  },
  {
    serviceId: 'pinterest-1',
    serviceName: 'Pinterest',
    serviceType: 'socialMedia',
    platform: 'pinterest',
    username: 'marketingdesign',
    displayName: 'Marketing Design',
    profileImageUrl: 'https://placekitten.com/104/104',
    isConnected: true,
    status: 'inactive',
    metadata: {
      icon: 'pinterest-icon.png',
      description: 'Pinterest Business Account',
      accountType: 'business',
      scopes: ['boards:read', 'pins:read', 'pins:write']
    }
  }
];

const seedSocialAccounts = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await connectDB();
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Get the first user from the database
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({});
    
    if (!user) {
      throw new Error('No users found in the database. Please create a user first.');
    }
    
    console.log('👤 Found user:', user._id);
    
    // Delete existing social media integrations for this user
    await Integration.deleteMany({
      userId: user._id,
      serviceType: 'socialMedia'
    });
    
    console.log('🗑️ Deleted existing social media integrations');
    
    // Add dummy integrations
    const integrationsToAdd = dummyIntegrations.map(integration => ({
      ...integration,
      userId: user._id
    }));
    
    await Integration.insertMany(integrationsToAdd);
    
    console.log('✨ Successfully added dummy social media integrations');
    
    // Verify the data
    const addedIntegrations = await Integration.find({
      userId: user._id,
      serviceType: 'socialMedia'
    });
    
    console.log('📊 Added integrations:', addedIntegrations.length);
    addedIntegrations.forEach(integration => {
      console.log(` - ${integration.platform}: ${integration.username} (${integration.status})`);
    });
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding social accounts:', error);
    process.exit(1);
  }
};

seedSocialAccounts(); 