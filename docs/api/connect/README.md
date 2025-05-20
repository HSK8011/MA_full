# Connect API Documentation

## Overview
The Connect API provides endpoints for managing social media account connections in the Marketing Automation Tool. It handles discovery of available platforms, the OAuth connection process, and management of existing connections.

## Authentication
All Connect API endpoints require a valid JWT token in the Authorization header.

## Available Endpoints

### Account Management
- [List Connected Accounts](./list-accounts.md) - Retrieve all connected social accounts
- [Get Account Details](./get-account.md) - Get detailed information about a specific connected account
- [Disconnect Account](./disconnect-account.md) - Temporarily disconnect a social account
- [Reconnect Account](./reconnect-account.md) - Reconnect a previously disconnected account
- [Remove Account](./remove-account.md) - Permanently remove a connected account

### Connection Process
- [List Available Channels](./list-channels.md) - Get all available social platforms for connection
- [Initialize Connection](./initialize-connection.md) - Start the OAuth flow for a new connection
- [Complete Connection](./complete-connection.md) - Finalize the OAuth flow and create the account connection

### Account Settings
- [Update Queue Settings](./update-queue-settings.md) - Update posting schedule preferences for an account

## Data Models

### SocialAccount
```typescript
interface SocialAccount {
  id: string;
  userId: string;
  name: string;
  type: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'instagram' | 'shopify';
  status: 'connected' | 'disconnected';
  icon: string;
  accountId: string;
  accessToken: string;  // Stored securely, never exposed to frontend
  refreshToken: string; // Stored securely, never exposed to frontend
  tokenExpiresAt: Date;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  queueSettings?: {
    preferredTimes: string[];
    timezone: string;
    frequency: 'daily' | 'weekly' | 'custom';
    customSchedule?: any;
  };
}
```

### Channel
```typescript
interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  connectUrl: string;
  scopes: string[];
  requiresBusinessAccount: boolean;
}
```

## Error Codes
| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input parameters |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found |
| 409  | Conflict - Resource already exists |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error - Server-side error occurred |

## Rate Limits
- 100 requests per minute per authenticated user
- 1,000 requests per hour per authenticated user

## Versioning
The Connect API follows semantic versioning. The current version is v1.

## Changelog
- **v1.0.0** (2023-06-01)
  - Initial release with core account management functionality
- **v1.1.0** (2023-07-15)
  - Added queue settings functionality
  - Improved error handling for OAuth failures 