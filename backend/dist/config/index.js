"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from root directory
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
// Log environment status
console.log('Environment variables loaded:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
exports.config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb+srv://hk:harsh12345@marketing-automation.ikalmut.mongodb.net/?retryWrites=true&w=majority&appName=marketing-automation',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    emailUser: process.env.EMAIL_USER || 'your-email@gmail.com',
    emailPassword: process.env.EMAIL_PASSWORD || 'your-email-password',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
