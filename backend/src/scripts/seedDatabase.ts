import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { NotificationPreference } from '../models/NotificationPreference.js';
import { SocialAccount } from '../models/SocialAccount.js';
import { Notification } from '../models/Notification.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { DEFAULT_NOTIFICATION_TYPES } from './seedNotificationPreferences';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority&appName=marketing-automation';

async function clearDatabase() {
  console.log('Clearing database...');
  await User.deleteMany({});
  await NotificationPreference.deleteMany({});
  await SocialAccount.deleteMany({});
  await Notification.deleteMany({});
  console.log('Database cleared');
}

async function createUsers() {
  console.log('Creating users...');
  
  // Create admin user
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    phone: '+1234567890',
    timezone: 'Asia/Kolkata',
    isTwoFactorEnabled: true,
    isActivityLoggingEnabled: true,
    isEmailVerified: true,
    role: 'admin'
  });

  // Create employee user
  const employeeUser = await User.create({
    name: 'Employee User',
    email: 'employee@example.com',
    password: await bcrypt.hash('employee123', 10),
    phone: '+9876543210',
    timezone: 'Asia/Kolkata',
    isTwoFactorEnabled: false,
    isActivityLoggingEnabled: true,
    isEmailVerified: true,
    role: 'employee'
  });

  console.log('Users created');
  return { adminUser, employeeUser };
}

async function createSocialAccounts(users: { adminUser: any, employeeUser: any }) {
  console.log('Creating social accounts...');
  
  const socialAccounts = [
    {
      userId: users.adminUser._id,
      platform: 'facebook',
      accountId: 'fb_123',
      username: 'admin.facebook',
      displayName: 'Admin FB Page',
      profileImageUrl: 'https://example.com/admin-fb.jpg',
      accessToken: 'fb_token_123',
      refreshToken: 'fb_refresh_123'
    },
    {
      userId: users.adminUser._id,
      platform: 'twitter',
      accountId: 'tw_123',
      username: 'admin_twitter',
      displayName: 'Admin Twitter',
      profileImageUrl: 'https://example.com/admin-twitter.jpg',
      accessToken: 'tw_token_123',
      refreshToken: 'tw_refresh_123'
    },
    {
      userId: users.adminUser._id,
      platform: 'instagram',
      accountId: 'ig_123',
      username: 'admin.instagram',
      displayName: 'Admin Instagram',
      profileImageUrl: 'https://example.com/admin-ig.jpg',
      accessToken: 'ig_token_123',
      refreshToken: 'ig_refresh_123'
    },
    {
      userId: users.adminUser._id,
      platform: 'linkedin',
      accountId: 'li_123',
      username: 'admin.linkedin',
      displayName: 'Admin LinkedIn',
      profileImageUrl: 'https://example.com/admin-li.jpg',
      accessToken: 'li_token_123',
      refreshToken: 'li_refresh_123'
    },
    {
      userId: users.adminUser._id,
      platform: 'pinterest',
      accountId: 'pin_123',
      username: 'admin.pinterest',
      displayName: 'Admin Pinterest',
      profileImageUrl: 'https://example.com/admin-pin.jpg',
      accessToken: 'pin_token_123',
      refreshToken: 'pin_refresh_123'
    },
    {
      userId: users.employeeUser._id,
      platform: 'facebook',
      accountId: 'fb_456',
      username: 'employee.facebook',
      displayName: 'Employee FB Page',
      profileImageUrl: 'https://example.com/employee-fb.jpg',
      accessToken: 'fb_token_456',
      refreshToken: 'fb_refresh_456'
    },
    {
      userId: users.employeeUser._id,
      platform: 'instagram',
      accountId: 'ig_456',
      username: 'employee.instagram',
      displayName: 'Employee Instagram',
      profileImageUrl: 'https://example.com/employee-ig.jpg',
      accessToken: 'ig_token_456',
      refreshToken: 'ig_refresh_456'
    }
  ];

  await SocialAccount.insertMany(socialAccounts);
  console.log('Social accounts created');
}

async function createNotificationPreferences(users: { adminUser: any, employeeUser: any }) {
  console.log('Creating notification preferences...');

  const createPreferencesForUser = async (userId: string) => {
    const preferences = DEFAULT_NOTIFICATION_TYPES.map(pref => ({
      userId,
      ...pref
    }));
    await NotificationPreference.insertMany(preferences);
  };

  await createPreferencesForUser(users.adminUser._id);
  await createPreferencesForUser(users.employeeUser._id);
  
  console.log('Notification preferences created');
}

async function createSampleNotifications(users: { adminUser: any, employeeUser: any }) {
  console.log('Creating sample notifications...');

  const notifications = [
    // Admin notifications
    {
      userId: users.adminUser._id,
      type: 'new_post_created',
      title: 'New Post Created',
      message: 'Your post "Summer Sale" has been created and is ready for review',
      read: false,
      emailSent: true,
      desktopShown: true,
      metadata: { postId: 'post123', platform: 'facebook' }
    },
    {
      userId: users.adminUser._id,
      type: 'post_published',
      title: 'Post Published Successfully',
      message: 'Your post "Spring Collection" has been published to Facebook',
      read: true,
      emailSent: true,
      desktopShown: true,
      metadata: { postId: 'post456', platform: 'facebook' }
    },
    {
      userId: users.adminUser._id,
      type: 'approval_approved',
      title: 'Post Approved',
      message: 'Employee\'s post "New Products" has been approved',
      read: false,
      emailSent: true,
      desktopShown: false,
      metadata: { postId: 'post789', employeeId: users.employeeUser._id }
    },

    // Employee notifications
    {
      userId: users.employeeUser._id,
      type: 'new_approval_requested',
      title: 'Approval Requested',
      message: 'Your post "New Products" is waiting for approval',
      read: false,
      emailSent: true,
      desktopShown: true,
      metadata: { postId: 'post789', adminId: users.adminUser._id }
    },
    {
      userId: users.employeeUser._id,
      type: 'post_scheduled',
      title: 'Post Scheduled',
      message: 'Your post "Weekly Update" has been scheduled for tomorrow',
      read: true,
      emailSent: true,
      desktopShown: true,
      metadata: { postId: 'post101', scheduledTime: new Date().toISOString() }
    }
  ];

  await Notification.insertMany(notifications);
  console.log('Sample notifications created');
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    await clearDatabase();
    const users = await createUsers();
    await createSocialAccounts(users);
    await createNotificationPreferences(users);
    await createSampleNotifications(users);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed script
seedDatabase();
