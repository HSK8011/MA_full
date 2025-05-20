# Connect API Schemas

## Overview
This document provides detailed schema definitions for all data models used in the Connect API. These schemas define the structure of request and response objects used across the various Connect API endpoints.

## Core Schemas

### SocialAccount
The `SocialAccount` schema represents a connected social media account.

```typescript
interface SocialAccount {
  // Core account identifiers
  id: string;                 // Unique identifier for the account in our system
  userId: string;             // Reference to the user who owns this connection
  accountId: string;          // Platform-specific account identifier
  
  // Display information
  name: string;               // Username or account name
  displayName?: string;       // Full display name (if different from name)
  type: string;               // Account type (e.g., "Twitter Profile", "LinkedIn Page")
  platform: PlatformType;     // Social media platform
  icon: string;               // Path to the platform icon
  profileImageUrl?: string;   // URL to the account's profile image
  
  // Authentication data (never exposed to frontend)
  accessToken: string;        // OAuth access token
  refreshToken: string;       // OAuth refresh token (if available)
  tokenExpiresAt: Date;       // Expiration timestamp for the access token
  
  // Status information
  status: ConnectionStatus;   // Current connection status
  lastSyncedAt: Date;         // When the account data was last refreshed
  healthStatus?: HealthStatus; // Account health indicator
  errorMessage?: string;      // Last error message (if any)
  
  // Posting preferences
  queueSettings?: QueueSettings; // Posting schedule configuration
  
  // Metadata
  createdAt: Date;            // When the connection was first created
  updatedAt: Date;            // When the connection was last updated
  scopes: string[];           // OAuth permission scopes granted
}

// Platform types supported by the system
type PlatformType = 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'instagram' | 'shopify';

// Connection status values
type ConnectionStatus = 'connected' | 'disconnected' | 'expired' | 'revoked' | 'error';

// Account health indicator
type HealthStatus = 'healthy' | 'warning' | 'error';
```

### Channel
The `Channel` schema represents an available social platform that users can connect to.

```typescript
interface Channel {
  // Core channel identifiers
  id: string;                 // Unique identifier for the platform
  
  // Display information
  name: string;               // Display name (e.g., "Twitter Profile")
  icon: string;               // Path to the platform icon
  description: string;        // Brief description of the channel
  
  // Connection information
  connectUrl: string;         // URL path for initiating connection
  authType: AuthType;         // Authentication method used
  scopes: string[];           // Required OAuth scopes for full functionality
  
  // Requirements and limitations
  requiresBusinessAccount: boolean; // Whether a business account is required
  setupInstructions?: string; // Special setup instructions
  accountLimit?: number;      // Maximum number of accounts per user (if limited)
  
  // Feature support
  supportedFeatures: ChannelFeature[]; // Features supported by this platform
  mediaSupport: MediaSupport; // Media types supported for posting
}

// Authentication types
type AuthType = 'oauth1' | 'oauth2' | 'apiKey';

// Channel features
type ChannelFeature = 
  'scheduling' | 
  'analytics' | 
  'engagement' | 
  'directMessages' | 
  'mediaUpload' | 
  'multipleAccounts' | 
  'teamAccess';

// Media support configuration
interface MediaSupport {
  image: boolean;             // Support for image uploads
  video: boolean;             // Support for video uploads
  gif: boolean;               // Support for GIF uploads
  carousel: boolean;          // Support for multiple images/carousel
  maxImageSize?: number;      // Maximum image file size in bytes
  maxVideoSize?: number;      // Maximum video file size in bytes
  maxVideoDuration?: number;  // Maximum video duration in seconds
  allowedImageTypes?: string[]; // Allowed image MIME types
  allowedVideoTypes?: string[]; // Allowed video MIME types
}
```

### QueueSettings
The `QueueSettings` schema represents posting schedule preferences for a connected account.

```typescript
interface QueueSettings {
  // Time settings
  timezone: string;           // User's preferred timezone (e.g., "America/New_York")
  preferredTimes: string[];   // Preferred posting times in 24h format (e.g., ["09:00", "17:30"])
  
  // Frequency settings
  frequency: FrequencyType;   // How often to post
  customSchedule?: CustomSchedule; // Used when frequency is "custom"
  postsPerDay?: number;       // Target number of posts per day
  
  // Behavioral settings
  enableAutoScheduling: boolean; // Whether to auto-schedule posts
  respectQuietHours: boolean;  // Whether to respect quiet hours
  quietHoursStart?: string;    // Start of quiet hours (24h format)
  quietHoursEnd?: string;      // End of quiet hours (24h format)
  
  // Metadata
  updatedAt: Date;            // When settings were last updated
}

// Frequency types
type FrequencyType = 'daily' | 'weekly' | 'weekdays' | 'weekends' | 'custom' | 'optimal';

// Custom schedule configuration (for "custom" frequency)
interface CustomSchedule {
  monday?: string[];          // Posting times for Monday
  tuesday?: string[];         // Posting times for Tuesday
  wednesday?: string[];       // Posting times for Wednesday
  thursday?: string[];        // Posting times for Thursday
  friday?: string[];          // Posting times for Friday
  saturday?: string[];        // Posting times for Saturday
  sunday?: string[];          // Posting times for Sunday
}
```

### UserPlan
The `UserPlan` schema represents a user's subscription plan details.

```typescript
interface UserPlan {
  // Core plan information
  plan: PlanType;             // Plan name/type
  status: PlanStatus;         // Current status
  
  // Usage metrics
  accountsUsed: number;       // Number of connected accounts
  accountLimit: number;       // Maximum allowed accounts
  scheduledPostsUsed: number; // Number of scheduled posts
  scheduledPostsLimit: number; // Maximum allowed scheduled posts
  
  // Trial information
  trialDaysRemaining?: number; // Days remaining in trial (if applicable)
  trialEndDate?: Date;        // When trial expires
  
  // Features
  features: string[];         // Enabled features for this plan
  
  // Billing information
  billingCycle?: 'monthly' | 'annual'; // Billing frequency
  nextBillingDate?: Date;     // Next payment date
}

// Plan types
type PlanType = 'free' | 'starter' | 'professional' | 'enterprise' | 'custom';

// Plan status values
type PlanStatus = 'active' | 'trial' | 'pastDue' | 'canceled' | 'expired';
```

## Request/Response Schemas

### Account Listing Response
```typescript
interface ListAccountsResponse {
  accounts: AccountSummary[];
  pagination: PaginationInfo;
}

interface AccountSummary {
  id: string;
  name: string;
  type: string;
  platform: PlatformType;
  status: ConnectionStatus;
  icon: string;
  lastSyncedAt: Date;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
```

### Channel Listing Response
```typescript
interface ListChannelsResponse {
  channels: ChannelSummary[];
}

interface ChannelSummary {
  id: string;
  name: string;
  icon: string;
  description: string;
  connectUrl: string;
}
```

### Connection Initialization Request
```typescript
interface InitializeConnectionRequest {
  platform: string;
  redirectUri?: string;       // Optional custom redirect URI
  extraScopes?: string[];     // Optional additional scopes
}
```

### Connection Initialization Response
```typescript
interface InitializeConnectionResponse {
  authorizationUrl: string;   // URL to redirect user for authorization
  state: string;              // CSRF protection token
  expiresAt: Date;            // When the auth request expires
}
```

### Connection Completion Request
```typescript
interface CompleteConnectionRequest {
  platform: string;
  code: string;               // Authorization code from OAuth provider
  state: string;              // CSRF protection token from initialization
  redirectUri?: string;       // Must match the one used in initialization
}
```

### Connection Completion Response
```typescript
interface CompleteConnectionResponse {
  success: boolean;
  account?: AccountSummary;   // The newly connected account
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Queue Settings Update Request
```typescript
interface UpdateQueueSettingsRequest {
  timezone?: string;
  preferredTimes?: string[];
  frequency?: FrequencyType;
  customSchedule?: CustomSchedule;
  postsPerDay?: number;
  enableAutoScheduling?: boolean;
  respectQuietHours?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}
```

## Platform-Specific Data

### Twitter Account Details
```typescript
interface TwitterAccountDetails extends SocialAccount {
  platformSpecific: {
    followersCount: number;
    followingCount: number;
    tweetCount: number;
    isVerified: boolean;
    location?: string;
    description?: string;
  };
}
```

### LinkedIn Account Details
```typescript
interface LinkedInAccountDetails extends SocialAccount {
  platformSpecific: {
    connectionCount?: number;
    followerCount?: number;
    isCompanyPage: boolean;
    companySize?: string;
    industry?: string;
  };
}
```

### Facebook Account Details
```typescript
interface FacebookAccountDetails extends SocialAccount {
  platformSpecific: {
    pageCategory?: string;
    pageFollowersCount?: number;
    pageLikesCount?: number;
    isGroup: boolean;
    groupMemberCount?: number;
    privacy?: 'public' | 'private' | 'closed';
  };
}
```

## Common Patterns

### Error Response
All API errors follow this standard format:

```typescript
interface ErrorResponse {
  error: string;              // Error code or type
  message: string;            // Human-readable error message
  details?: any;              // Additional error details (optional)
  requestId?: string;         // Request identifier for troubleshooting
}
```

### Pagination Parameters
All list endpoints accept these common pagination parameters:

```typescript
interface PaginationParams {
  limit?: number;             // Items per page (default varies by endpoint)
  offset?: number;            // Offset from the first item (default: 0)
  sort?: string;              // Sort field (format: 'field:direction')
}
``` 