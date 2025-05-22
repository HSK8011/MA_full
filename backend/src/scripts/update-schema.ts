import mongoose from 'mongoose';
import connectDB from '../config/database';
import { config } from '../config';

// Import all models to ensure schemas are registered with MongoDB
import '../models/User';
import '../models/NotificationPreference';
import '../models/QueueSetting';
import '../models/Integration';
import '../models/ActivityLog';

// Define function to update schema
const updateSchema = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await connectDB();
    
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Current MongoDB connection string:', config.mongodbUri.substring(0, 35) + '...');
    
    // Get list of collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Existing collections in the database:');
    collections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });
    
    // User model indexes
    const userIndexes = await mongoose.connection.db.collection('users').indexes();
    console.log('\n📑 Indexes for users collection:');
    Object.values(userIndexes).forEach(index => {
      console.log(` - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Test if new schema fields are recognized
    const userCollection = mongoose.connection.db.collection('users');
    
    console.log('\n🔍 Checking if new fields are needed in users collection...');
    // Get a sample user to check schema
    const sampleUser = await userCollection.findOne({});
    
    if (sampleUser) {
      const missingFields = [];
      if (!('phone' in sampleUser)) missingFields.push('phone');
      if (!('timezone' in sampleUser)) missingFields.push('timezone');
      if (!('isTwoFactorEnabled' in sampleUser)) missingFields.push('isTwoFactorEnabled');
      if (!('isActivityLoggingEnabled' in sampleUser)) missingFields.push('isActivityLoggingEnabled');
      if (!('lastPasswordChange' in sampleUser)) missingFields.push('lastPasswordChange');
      
      if (missingFields.length > 0) {
        console.log(`⚠️ Missing fields in user schema: ${missingFields.join(', ')}`);
        console.log('🔄 Updating user documents with default values for missing fields...');
        
        const updateResult = await userCollection.updateMany(
          { $or: missingFields.map(field => ({ [field]: { $exists: false } })) },
          { 
            $set: {
              phone: null,
              timezone: 'Culcutta (+05:30)',
              isTwoFactorEnabled: false,
              isActivityLoggingEnabled: true,
              lastPasswordChange: new Date()
            } 
          }
        );
        
        console.log(`✅ Updated ${updateResult.modifiedCount} user documents with default values`);
      } else {
        console.log('✅ User schema is up to date');
      }
    } else {
      console.log('⚠️ No user documents found to check schema');
    }
    
    // Ensure indexes on all collections
    console.log('\n📊 Creating/Verifying indexes...');

    // Function to safely create an index (drop first if exists)
    const safeCreateIndex = async (
      collectionName: string, 
      indexSpec: Record<string, number>, 
      options: mongoose.mongo.CreateIndexesOptions
    ): Promise<void> => {
      const collection = mongoose.connection.db.collection(collectionName);
      
      try {
        // Check if the collection exists
        const collExists = collections.some(coll => coll.name === collectionName);
        if (!collExists) {
          console.log(`ℹ️ Collection ${collectionName} doesn't exist yet. It will be created when data is added.`);
          return;
        }
        
        // Get existing indexes
        const indexes = await collection.indexes();
        
        // Find if index with same name already exists
        const indexName = options.name || Object.keys(indexSpec).map(k => `${k}_${indexSpec[k]}`).join('_');
        const existingIndex = indexes.find(idx => idx.name === indexName);
        
        if (existingIndex) {
          console.log(`🔄 Dropping existing index ${indexName} on ${collectionName}...`);
          await collection.dropIndex(indexName);
        }
        
        // Create the index
        await collection.createIndex(indexSpec, options);
        console.log(`✅ Created index ${indexName} on ${collectionName}`);
      } catch (error) {
        console.error(`❌ Error managing index on ${collectionName}:`, error);
      }
    };
    
    // NotificationPreference indexes
    await safeCreateIndex(
      'notificationpreferences',
      { userId: 1, type: 1 },
      { unique: true, background: true }
    );
    
    // QueueSetting indexes
    await safeCreateIndex(
      'queuesettings',
      { userId: 1, accountId: 1 },
      { unique: true, background: true }
    );
    
    // Integration indexes
    await safeCreateIndex(
      'integrations',
      { userId: 1, serviceId: 1 },
      { unique: true, background: true }
    );
    
    // ActivityLog indexes
    await safeCreateIndex(
      'activitylogs',
      { userId: 1 },
      { background: true }
    );
    
    // Handle the special case for timestamp TTL index
    try {
      const activityLogsCollection = mongoose.connection.db.collection('activitylogs');
      
      // Check if collection exists
      const collExists = collections.some(coll => coll.name === 'activitylogs');
      if (collExists) {
        // Get existing indexes
        const indexes = await activityLogsCollection.indexes();
        
        // Check for existing timestamp index with different name
        const existingTimestampIndex = indexes.find(idx => 
          idx.name === 'timestamp_1' && 
          idx.key && 
          idx.key.timestamp === 1
        );
        
        if (existingTimestampIndex) {
          console.log(`🔄 Dropping existing timestamp index with name timestamp_1 on activitylogs...`);
          await activityLogsCollection.dropIndex('timestamp_1');
          console.log('✅ Dropped existing timestamp index');
        }
        
        // Create new index with TTL
        await activityLogsCollection.createIndex(
          { timestamp: 1 },
          { 
            expireAfterSeconds: 7776000, // 90 days
            background: true,
            name: 'timestamp_ttl'
          }
        );
        console.log('✅ Created timestamp_ttl index on activitylogs with TTL of 90 days');
      }
    } catch (error) {
      console.error(`❌ Error updating timestamp index on activitylogs:`, error);
    }
    
    console.log('\n🎉 Schema update completed successfully!');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
};

// Run the update function
updateSchema(); 
