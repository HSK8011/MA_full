import mongoose from 'mongoose';
import { Integration } from '../models/Integration';

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
 * Remove newly added integrations while preserving existing ones
 */
const removeNewIntegrations = async () => {
  try {
    await connectDB();
    
    // Remove social media integrations that were just added
    const socialMediaResult = await Integration.deleteMany({
      serviceType: 'socialMedia',
      platform: { $in: ['facebook', 'instagram', 'twitter'] }
    });
    
    // Remove the Short.io integration that was just added
    const shortioResult = await Integration.deleteMany({
      serviceId: 'shortio'
    });
    
    // Revert the Bitly integration to its original state (disconnected)
    const bitlyResult = await Integration.updateMany(
      { serviceId: 'bitly' },
      { 
        $set: {
          isConnected: false,
          status: 'inactive',
          credentials: {}
        },
        $unset: {
          lastConnectedAt: "",
          settings: ""
        }
      }
    );
    
    console.log('\n✅ Cleanup Results:');
    console.log(`- Removed ${socialMediaResult.deletedCount} social media integrations`);
    console.log(`- Removed ${shortioResult.deletedCount} Short.io integrations`);
    console.log(`- Reverted ${bitlyResult.modifiedCount} Bitly integrations to original state`);
    
    // Display remaining integrations
    const remainingCount = await Integration.countDocuments();
    const remainingTypes = await Integration.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } }
    ]);
    
    console.log(`\n📊 Remaining integrations: ${remainingCount}`);
    console.log('📊 Integrations by type:');
    remainingTypes.forEach(type => {
      console.log(`   - ${type._id}: ${type.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error removing integrations:', error);
    process.exit(1);
  }
};

// Run the cleanup function
removeNewIntegrations();
