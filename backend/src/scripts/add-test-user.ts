import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config';

// Make sure environment variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

async function addTestUser() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Using MongoDB URI:', config.mongoUri.substring(0, 25) + '...');
    
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists with ID:', existingUser._id);
      console.log('Email:', existingUser.email);
      console.log('Password is hashed, but the original is "password123"');
    } else {
      // Create a test user
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        isEmailVerified: true
      });

      await testUser.save();
      console.log('Test user created successfully with ID:', testUser._id);
      console.log('Email: test@example.com');
      console.log('Password: password123');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestUser(); 