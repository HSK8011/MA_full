"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultIntegrations = exports.DEFAULT_INTEGRATIONS = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Integration_1 = require("../models/Integration");
const database_1 = __importDefault(require("../config/database"));
const User_1 = require("../models/User");
exports.DEFAULT_INTEGRATIONS = [
    {
        serviceId: 'bitly',
        serviceName: 'Bitly',
        serviceType: 'urlShortener',
        isConnected: false,
        metadata: {
            icon: '/images/bitly-logo.png',
            description: 'Shorten, create and share trusted links',
            website: 'https://bitly.com',
            apiDocumentation: 'https://dev.bitly.com/'
        }
    },
    {
        serviceId: 'rebrandly',
        serviceName: 'Rebrandly',
        serviceType: 'urlShortener',
        isConnected: false,
        metadata: {
            icon: '/images/rebrandly-logo.png',
            description: 'Custom branded domain URL shortener',
            website: 'https://www.rebrandly.com',
            apiDocumentation: 'https://developers.rebrandly.com/'
        }
    },
    {
        serviceId: 'tinyurl',
        serviceName: 'TinyURL',
        serviceType: 'urlShortener',
        isConnected: false,
        metadata: {
            icon: '/images/tinyurl-logo.png',
            description: 'Easy-to-use URL shortening service',
            website: 'https://tinyurl.com',
            apiDocumentation: 'https://tinyurl.com/app/dev'
        }
    }
];
/**
 * Create default integrations for a new user
 * @param userId - MongoDB ObjectId of the user
 */
const createDefaultIntegrations = async (userId) => {
    try {
        const integrationsToCreate = exports.DEFAULT_INTEGRATIONS.map(integration => ({
            userId,
            ...integration,
            credentials: {},
        }));
        // Use insertMany for better performance
        await Integration_1.Integration.insertMany(integrationsToCreate);
        console.log(`✅ Created default integrations for user ${userId}`);
    }
    catch (error) {
        console.error('Error creating default integrations:', error);
        throw error;
    }
};
exports.createDefaultIntegrations = createDefaultIntegrations;
/**
 * Run this script directly to seed all integrations
 * This is for development/testing purposes only
 */
const seedAllIntegrations = async () => {
    if (process.env.NODE_ENV === 'production') {
        console.error('⛔ This script should not be run in production');
        process.exit(1);
    }
    try {
        await (0, database_1.default)();
        // Get the first user from the database if no user ID is provided
        const user = await User_1.User.findOne();
        const testUserId = process.argv[2] || user?._id;
        if (!testUserId) {
            throw new Error('No user found in the database');
        }
        const userId = new mongoose_1.default.Types.ObjectId(testUserId);
        // Delete existing integrations for this user
        await Integration_1.Integration.deleteMany({ userId });
        console.log(`🗑️ Deleted existing integrations for user ${userId}`);
        // Create new default integrations
        await (0, exports.createDefaultIntegrations)(userId);
        console.log('✅ Successfully seeded integrations');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding integrations:', error);
        process.exit(1);
    }
};
// Run the script if called directly (not imported)
if (require.main === module) {
    seedAllIntegrations();
}
