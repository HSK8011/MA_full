import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config';

const createDummyUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB Atlas');

    // Create dummy user
    const dummyUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test@123',
      isEmailVerified: true
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: dummyUser.email });
    if (existingUser) {
      console.log('Dummy user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create new user
    const user = await User.create(dummyUser);
    console.log('Dummy user created successfully:', {
      id: user._id,
      name: user.name,
      email: user.email
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating dummy user:', error);
    process.exit(1);
  }
};

createDummyUser(); 
