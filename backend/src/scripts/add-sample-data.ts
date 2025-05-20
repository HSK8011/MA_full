import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database';

const addSampleData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await connectDB();
    console.log('✅ Connected to MongoDB Atlas');

    // Add sample user
    const userCollection = mongoose.connection.db.collection('users');
    const hashedPassword = await bcrypt.hash('SamplePass123!', 10);
    
    const user = await userCollection.insertOne({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      phone: '+1234567890',
      timezone: 'UTC',
      isTwoFactorEnabled: false,
      isActivityLoggingEnabled: true,
      lastPasswordChange: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Added sample user');
    const userId = user.insertedId;

    // Add sample notification preference
    const notificationPrefCollection = mongoose.connection.db.collection('notificationpreferences');
    await notificationPrefCollection.insertOne({
      userId: userId,
      type: 'email',
      enabled: true,
      frequency: 'daily',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Added sample notification preference');

    // Add sample queue setting
    const queueSettingCollection = mongoose.connection.db.collection('queuesettings');
    await queueSettingCollection.insertOne({
      userId: userId,
      accountId: 'ACC123',
      maxConcurrentJobs: 5,
      retryAttempts: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Added sample queue setting');

    // Add sample integration
    const integrationCollection = mongoose.connection.db.collection('integrations');
    await integrationCollection.insertOne({
      userId: userId,
      serviceId: 'MAILCHIMP',
      apiKey: 'sample_api_key_123',
      status: 'active',
      settings: {
        listId: 'LIST123',
        audienceId: 'AUD123'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Added sample integration');

    // Add sample activity log
    const activityLogCollection = mongoose.connection.db.collection('activitylogs');
    await activityLogCollection.insertOne({
      userId: userId,
      action: 'USER_LOGIN',
      details: 'User logged in successfully',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      timestamp: new Date(),
      createdAt: new Date()
    });
    console.log('✅ Added sample activity log');

    console.log('\n🎉 Successfully added sample data to all collections!');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB Atlas');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
};

// Run the function
addSampleData(); 