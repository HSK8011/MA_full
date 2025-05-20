"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const createDummyUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(config_1.config.mongoUri);
        console.log('Connected to MongoDB Atlas');
        // Create dummy user
        const dummyUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Test@123',
            isEmailVerified: true
        };
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email: dummyUser.email });
        if (existingUser) {
            console.log('Dummy user already exists');
            await mongoose_1.default.disconnect();
            return;
        }
        // Create new user
        const user = await User_1.User.create(dummyUser);
        console.log('Dummy user created successfully:', {
            id: user._id,
            name: user.name,
            email: user.email
        });
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
    catch (error) {
        console.error('Error creating dummy user:', error);
        process.exit(1);
    }
};
createDummyUser();
