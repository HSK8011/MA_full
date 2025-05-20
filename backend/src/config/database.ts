import mongoose from 'mongoose';
import { config } from './index';

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('Using MongoDB URI:', config.mongodbUri.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(config.mongodbUri);
    
    const conn = mongoose.connection;
    console.log(`✅ MongoDB Connected: ${conn.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB; 