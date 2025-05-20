"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const config_1 = require("../config");
// Make sure environment variables are loaded
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../../.env') });
async function addTestUser() {
    try {
        console.log('Connecting to MongoDB...');
        console.log('Using MongoDB URI:', config_1.config.mongoUri.substring(0, 25) + '...');
        await mongoose_1.default.connect(config_1.config.mongoUri);
        console.log('Connected to MongoDB');
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('Test user already exists with ID:', existingUser._id);
            console.log('Email:', existingUser.email);
            console.log('Password is hashed, but the original is "password123"');
        }
        else {
            // Create a test user
            const testUser = new User_1.User({
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
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
addTestUser();
