import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT ?? 5000,
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority&appName=marketing-automation',
  jwtSecret: process.env.JWT_SECRET ?? 'your-super-secret-jwt-key-2024',
  jwtAccessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY ?? '7d', // 7 days
  jwtRefreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY ?? '30d', // 30 days
  nodeEnv: process.env.NODE_ENV ?? 'development',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  emailUser: process.env.EMAIL_USER ?? 'noreply@example.com',
  emailPassword: process.env.EMAIL_PASSWORD ?? 'your-email-password',
  // Twitter API configuration
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID ?? 'your-twitter-client-id',
    clientSecret: process.env.TWITTER_CLIENT_SECRET ?? 'your-twitter-client-secret',
    callbackUrl: process.env.TWITTER_CALLBACK_URL ?? 'http://localhost:5173/auth/twitter/callback'
  }
};