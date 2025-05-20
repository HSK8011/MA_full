"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = __importDefault(require("../config/database"));
const verifySchema = async () => {
    try {
        console.log('🔄 Connecting to MongoDB Atlas...');
        await (0, database_1.default)();
        console.log('✅ Connected to MongoDB Atlas');
        console.log('\n📊 Verifying database schema...');
        // Get list of collections
        const collections = await mongoose_1.default.connection.db.listCollections().toArray();
        console.log('\n📂 Collections in the database:');
        collections.forEach(collection => {
            console.log(` - ${collection.name}`);
        });
        // Check User schema
        console.log('\n👤 Verifying User schema:');
        const userCollection = mongoose_1.default.connection.db.collection('users');
        const sampleUser = await userCollection.findOne({});
        if (sampleUser) {
            console.log(' Fields present in User document:');
            Object.keys(sampleUser).forEach(field => {
                const value = typeof sampleUser[field] === 'object' ? '[Object]' : sampleUser[field];
                console.log(` - ${field}: ${value}`);
            });
            // Check for required fields
            const requiredFields = [
                'name', 'email', 'password', 'phone', 'timezone',
                'isTwoFactorEnabled', 'isActivityLoggingEnabled', 'lastPasswordChange'
            ];
            const missingFields = requiredFields.filter(field => !(field in sampleUser));
            if (missingFields.length === 0) {
                console.log(' ✅ User schema is complete with all required fields');
            }
            else {
                console.log(` ❌ Missing fields in User schema: ${missingFields.join(', ')}`);
            }
        }
        else {
            console.log(' ❌ No User documents found');
        }
        // Check indexes on all collections
        console.log('\n📊 Verifying indexes on collections:');
        // Function to check indexes on a collection
        const checkIndexes = async (collectionName, expectedIndexes) => {
            try {
                const collection = mongoose_1.default.connection.db.collection(collectionName);
                const indexes = await collection.indexes();
                console.log(`\n🔍 Indexes on ${collectionName}:`);
                indexes.forEach(index => {
                    console.log(` - ${index.name}: ${JSON.stringify(index.key)}${index.expireAfterSeconds ? ' (TTL: ' + index.expireAfterSeconds + 's)' : ''}`);
                });
                // Check for expected indexes
                const indexNames = indexes.map(idx => idx.name);
                const missingIndexes = expectedIndexes.filter(idx => !indexNames.includes(idx));
                if (missingIndexes.length === 0) {
                    console.log(` ✅ All expected indexes present on ${collectionName}`);
                }
                else {
                    console.log(` ❌ Missing indexes on ${collectionName}: ${missingIndexes.join(', ')}`);
                }
            }
            catch (error) {
                console.error(`❌ Error checking indexes on ${collectionName}:`, error);
            }
        };
        // Verify indexes on collections
        if (collections.some(coll => coll.name === 'users')) {
            await checkIndexes('users', ['_id_', 'email_1']);
        }
        if (collections.some(coll => coll.name === 'notificationpreferences')) {
            await checkIndexes('notificationpreferences', ['_id_', 'userId_1_type_1']);
        }
        if (collections.some(coll => coll.name === 'queuesettings')) {
            await checkIndexes('queuesettings', ['_id_', 'userId_1_accountId_1']);
        }
        if (collections.some(coll => coll.name === 'integrations')) {
            await checkIndexes('integrations', ['_id_', 'userId_1_serviceId_1']);
        }
        if (collections.some(coll => coll.name === 'activitylogs')) {
            await checkIndexes('activitylogs', ['_id_', 'userId_1', 'timestamp_ttl']);
        }
        // Close the connection
        await mongoose_1.default.connection.close();
        console.log('\n👋 Disconnected from MongoDB Atlas');
    }
    catch (error) {
        console.error('❌ Error verifying schema:', error);
        process.exit(1);
    }
};
// Run the verification function
verifySchema();
