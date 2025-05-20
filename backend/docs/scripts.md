# Backend Scripts Documentation

This document outlines the utility scripts available in the backend application.

## Adding Test User

Script: `add-test-user.ts`

Purpose: Creates a test user in the database for development and testing purposes.

### Usage

Run the script from the backend directory:

```bash
npm run add-test-user
```

### Details

The script creates a user with the following credentials:
- **Email**: test@example.com
- **Password**: password123
- **Name**: Test User
- **Email Verified**: true

If a user with the email `test@example.com` already exists, the script will not create a duplicate user and will report that the user already exists.

### Implementation Notes

The script:
1. Connects to MongoDB using the URI configured in the `.env` file
2. Checks if the test user already exists
3. If not, creates the test user with the specified credentials
4. Logs the result and disconnects from the database

This script is useful for setting up a consistent test account that can be used for manual testing or automated tests.

### Example Output

When creating a new user:
```
Connecting to MongoDB...
Using MongoDB URI: mongodb+srv://hk:harsh...
Connected to MongoDB
Test user created successfully with ID: 60f1e2b3c4d5e6f7g8h9i0j1
Email: test@example.com
Password: password123
Disconnected from MongoDB
```

When the user already exists:
```
Connecting to MongoDB...
Using MongoDB URI: mongodb+srv://hk:harsh...
Connected to MongoDB
Test user already exists with ID: 60f1e2b3c4d5e6f7g8h9i0j1
Email: test@example.com
Password is hashed, but the original is "password123"
Disconnected from MongoDB
``` 