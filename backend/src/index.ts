import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/userRoutes';
import settingsRoutes from './routes/settings.routes';
import integrationRoutes from './routes/integration.routes';
import analyticsRoutes from './routes/analyticsRoutes';
import postRoutes from './routes/postRoutes';
import twitterRoutes from './routes/twitter.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Match your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'cache-control',
    'Cache-Control',
    'pragma',
    'Pragma',
    'expires',
    'Expires'
  ],
  exposedHeaders: ['Content-Range', 'X-Total-Count']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/connect', integrationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/twitter', twitterRoutes); 

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Marketing Automation API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      settings: '/api/settings',
      connect: '/api/connect',
      analytics: '/api/analytics',
      posts: '/api/posts'
    }
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT ?? 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 