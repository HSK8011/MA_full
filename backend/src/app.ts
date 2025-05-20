import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import integrationRoutes from './routes/integration.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/userRoutes';
import settingsRoutes from './routes/settings.routes';
import postRoutes from './routes/postRoutes';

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'], // Match your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'cache-control',
    'Cache-Control',
    'pragma',
    'expires',
    'Accept'
  ],
  exposedHeaders: ['Content-Range', 'X-Total-Count']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connect', integrationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/posts', postRoutes);

export default app; 