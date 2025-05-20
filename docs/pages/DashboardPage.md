# DashboardPage Documentation

## Overview
The DashboardPage serves as the main interface for authenticated users after logging into the Marketing Automation Tool (MAT). It provides an overview of key analytics, scheduled content, and engagement metrics for the user's social media accounts.

## File Location
- **Component Path**: `src/components/templates/DashboardPage.tsx`
- **Related Components**:
  - Header (`src/components/organisms/Header.tsx`)
  - Container (`src/components/atoms/ui/container.tsx`)
  - ChannelAnalytics (`src/components/organisms/ChannelAnalytics/ChannelAnalytics.tsx`)

## Page Structure
```
DashboardPage
├── Header (Navigation + User Menu)
└── Main Content
    ├── Dashboard Title
    └── Dashboard Cards
        ├── Channel Analytics Card
        ├── Recent Posts Card
        ├── Upcoming (Scheduled) Posts Card
        └── Recent Engagement Card
```

## Component Details

### Header Component
- **Purpose**: Main navigation and user actions
- **Authentication Buttons**:
  - "Dashboard" - Links to dashboard page (current page)
  - "Logout" - Handles user logout
- **Conditional Rendering**:
  - Shows "Dashboard" and "Logout" buttons when user is authenticated (always true on this page)
- **Navigation Links**:
  - Same as HomePage

### Dashboard Cards
The dashboard currently displays four main information cards:

1. **Channel Analytics Card**
   - **Purpose**: Provides platform-specific analytics across social media channels
   - **Data Source**: External social media platform APIs
   - **Content**: Metrics like followers, posts, engagements specific to each platform
   - **Interactions**: Time period selection (today, week, month, custom), platform switching, account selection
   - **API Integration**: Real-time data from social media platforms' analytics APIs

2. **Recent Posts Card**
   - **Purpose**: Shows recently published posts across connected social accounts
   - **Data Source**: External social media platform APIs 
   - **Content**: Published post content, metrics, and platform indicators
   - **Interactions**: View post details, filter by platform, view engagement metrics
   - **API Integration**: Fetches published post data directly from social platforms

3. **Upcoming Posts Card**
   - **Purpose**: Shows scheduled posts that haven't been published yet
   - **Data Source**: Internal application database
   - **Content**: Post preview, scheduled time, target platforms
   - **Interactions**: Edit/delete scheduled posts, create new posts
   - **API Integration**: Internal API for retrieving and managing scheduled posts

4. **Recent Engagement Card**
   - **Purpose**: Summarizes recent audience interactions
   - **Data Source**: External social media platform APIs
   - **Content**: Recent comments, likes, shares across platforms
   - **Interactions**: Reply to comments, view engagement details
   - **API Integration**: Real-time engagement data from social platforms' APIs

## API Integration & Data Flow

### Data Flow Architecture
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  Social Media   │◄────┤  API Gateway &   │◄────┤   Application   │
│  Platform APIs  │     │  Proxy Services  │     │   Frontend      │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        ▲                        ▲
        │                        │                        │
        ▼                        │                        │
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  Data Cache &   │────►│  Application     │────►│  Authentication │
│  Rate Limiting  │     │  Database        │     │  Services       │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Channel Analytics Integration
- **Connection Method**: OAuth 2.0 for all platforms
- **Data Refresh Rate**: 
  - Real-time data for today's metrics (pulled on demand)
  - Cached data for historical metrics (refreshed every 6 hours)
- **Error Handling**:
  - Graceful degradation when APIs are unavailable
  - Fallback to cached data when rate limits are reached
  - Clear error states for disconnected accounts
- **Platforms**:
  - Twitter/X API v2
  - Facebook Graph API
  - LinkedIn Marketing API
  - Pinterest API

### Recent & Upcoming Posts Integration
- **Recent Posts**: Directly sourced from social platform APIs
- **Upcoming Posts**: Stored in application database
- **Scheduling System**:
  - Queue-based posting system
  - Redundant job processing for reliability
  - Webhook callbacks for post status updates
- **Content Management**:
  - Media storage in dedicated CDN
  - Text content stored in application database
  - Platform-specific formatting handled at posting time

### Recent Engagement Integration
- **Data Collection**:
  - Webhooks for real-time engagement notifications
  - Periodic polling for platforms without webhook support
- **Response System**:
  - Direct API integration for replying to comments/messages
  - Queue-based system for handling response failures

## Authentication & Access Control
- Page is protected and only accessible to authenticated users
- Authentication check in App.tsx redirects unauthenticated users to HomePage
- Authentication state is currently managed via localStorage
- Platform API tokens securely stored in backend, never exposed to frontend

## Route
- **Path**: `/dashboard`
- **Access**: Protected (authentication required)
- **Redirect**: Unauthenticated users are redirected to homepage

## Data Schema Requirements

### Social Account Schema
```typescript
interface SocialAccount {
  id: string;
  userId: string;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'pinterest' | 'instagram';
  accountId: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  accessToken: string; // Stored only in backend
  refreshToken: string; // Stored only in backend
  tokenExpiresAt: Date;
  isActive: boolean;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Channel Analytics Schema
```typescript
interface ChannelAnalytics {
  accountId: string;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'pinterest' | 'instagram';
  period: 'day' | 'week' | 'month' | 'custom';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    followers: {
      total: number;
      change: number;
      changePercent: number;
    };
    posts: {
      total: number;
      change: number;
    };
    queuedPosts: {
      total: number;
      change: number;
    };
    engagements: {
      total: number;
      change: number;
      changePercent: number;
      breakdown?: {
        likes: number;
        comments: number;
        shares: number;
        clicks: number;
        saves?: number;
        otherActions?: number;
      };
    };
    impressions?: {
      total: number;
      change: number;
      changePercent: number;
    };
    reach?: {
      total: number;
      change: number;
      changePercent: number;
    };
  };
  lastUpdated: Date;
}
```

### Dashboard Overview Schema
```typescript
interface DashboardOverview {
  user: {
    id: string;
    fullName: string;
    accountType: string;
    trialDaysRemaining?: number;
  };
  stats: {
    totalPosts: number;
    scheduledPosts: number;
    engagementRate: number;
    followers: number;
    followersGrowth: {
      value: number;
      percentage: number;
    };
    recentImpressions: number;
  };
  connectedAccounts: Array<{
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'pinterest';
    status: 'connected' | 'disconnected' | 'error';
    username: string;
    profileImage?: string;
  }>;
}
```

### Scheduled Posts Schema
```typescript
interface ScheduledPost {
  id: string;
  userId: string;
  content: string;
  mediaUrls?: string[];
  scheduledTime: Date;
  platforms: Array<'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'pinterest'>;
  status: 'scheduled' | 'posting' | 'posted' | 'failed';
  errorDetails?: string;
  retryCount?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  analytics?: {
    impressions?: number;
    engagements?: number;
    clicks?: number;
  };
}
```

### Published Post Schema
```typescript
interface PublishedPost {
  id: string;
  userId: string;
  originalContent: string;
  mediaUrls?: string[];
  publishedAt: Date;
  platformData: Array<{
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'pinterest';
    postId: string; // Platform-specific post ID
    postUrl: string;
    status: 'published' | 'deleted' | 'error';
    analytics: {
      impressions: number;
      engagements: number;
      likes: number;
      comments: number;
      shares: number;
      clicks?: number;
      saves?: number;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Engagement Schema
```typescript
interface EngagementData {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'pinterest';
  totalEngagements: number;
  comments: number;
  shares: number;
  likes: number;
  saves?: number;
  recentComments: Array<{
    id: string;
    user: {
      name: string;
      handle: string;
      profileImage?: string;
    };
    content: string;
    timestamp: Date;
    postId: string;
    responded: boolean;
  }>;
}
```

## API Endpoints

### Social Accounts Endpoints
- **List Accounts**
  - **Method**: GET
  - **Path**: `/api/social-accounts`
  - **Authentication**: Required (JWT token in headers)
  - **Response**: Array of connected social accounts

- **Connect Account**
  - **Method**: POST
  - **Path**: `/api/social-accounts/connect`
  - **Authentication**: Required (JWT token in headers)
  - **Response**: Redirect to OAuth flow for selected platform

- **Disconnect Account**
  - **Method**: DELETE
  - **Path**: `/api/social-accounts/:id`
  - **Authentication**: Required (JWT token in headers)
  - **Response**: Success message

### Channel Analytics Endpoint
- **Method**: GET
- **Path**: `/api/analytics/channel`
- **Query Parameters**:
  - accountId: string
  - platform: "facebook" | "twitter" | "instagram" | "linkedin" | "pinterest"
  - period: "day" | "week" | "month" | "custom"
  - startDate?: string (ISO format, for custom period)
  - endDate?: string (ISO format, for custom period)
- **Authentication**: Required (JWT token in headers)
- **Response**:
  ```json
  {
    "accountId": "account123",
    "platform": "twitter",
    "period": "week",
    "metrics": {
      "followers": {
        "total": 12547,
        "change": 245,
        "changePercent": 2.5
      },
      "posts": {
        "total": 15,
        "change": 8
      },
      "queuedPosts": {
        "total": 12,
        "change": 4
      },
      "engagements": {
        "total": 4250,
        "change": 750,
        "changePercent": 18
      }
    },
    "lastUpdated": "2023-12-01T12:30:45Z"
  }
  ```

### Dashboard Overview Endpoint
- **Method**: GET
- **Path**: `/api/dashboard/overview`
- **Authentication**: Required (JWT token in headers)
- **Response**:
  ```json
  {
    "user": {
      "id": "string",
      "fullName": "string",
      "accountType": "string",
      "trialDaysRemaining": 14
    },
    "stats": {
      "totalPosts": 45,
      "scheduledPosts": 12,
      "engagementRate": 3.2,
      "followers": 2540,
      "followersGrowth": {
        "value": 120,
        "percentage": 4.9
      },
      "recentImpressions": 10250
    },
    "connectedAccounts": [
      {
        "platform": "twitter",
        "status": "connected",
        "username": "matuser",
        "profileImage": "https://example.com/image.jpg"
      }
    ]
  }
  ```

### Recent Posts Endpoint
- **Method**: GET
- **Path**: `/api/posts/recent`
- **Query Parameters**:
  - page: number
  - limit: number
  - platform?: "facebook" | "twitter" | "instagram" | "linkedin" | "pinterest" | "all"
- **Authentication**: Required (JWT token in headers)
- **Response**:
  ```json
  {
    "total": 35,
    "page": 1,
    "limit": 10,
    "posts": [
      {
        "id": "post123",
        "originalContent": "Check out our new product!",
        "mediaUrls": ["https://example.com/image.jpg"],
        "publishedAt": "2023-11-30T10:00:00Z",
        "platformData": [
          {
            "platform": "twitter",
            "postId": "1234567890",
            "postUrl": "https://twitter.com/user/status/1234567890",
            "status": "published",
            "analytics": {
              "impressions": 3200,
              "engagements": 150,
              "likes": 85,
              "comments": 12,
              "shares": 23,
              "clicks": 30
            }
          }
        ]
      }
    ]
  }
  ```

### Scheduled Posts Endpoint
- **Method**: GET
- **Path**: `/api/posts/scheduled`
- **Query Parameters**:
  - page: number
  - limit: number
  - status: "scheduled" | "posting" | "posted" | "failed" | "all"
  - platform?: "facebook" | "twitter" | "instagram" | "linkedin" | "pinterest" | "all"
- **Authentication**: Required (JWT token in headers)
- **Response**:
  ```json
  {
    "total": 12,
    "page": 1,
    "limit": 10,
    "posts": [
      {
        "id": "post123",
        "content": "Check out our new product!",
        "mediaUrls": ["https://example.com/image.jpg"],
        "scheduledTime": "2023-11-30T10:00:00Z",
        "platforms": ["twitter", "facebook"],
        "status": "scheduled",
        "createdAt": "2023-11-25T15:23:00Z",
        "updatedAt": "2023-11-25T15:23:00Z"
      }
    ]
  }
  ```

### Engagement Data Endpoint
- **Method**: GET
- **Path**: `/api/analytics/engagement`
- **Query Parameters**:
  - platform: "facebook" | "twitter" | "instagram" | "linkedin" | "pinterest" | "all"
  - period: "day" | "week" | "month" | "year"
- **Authentication**: Required (JWT token in headers)
- **Response**:
  ```json
  {
    "platforms": [
      {
        "platform": "twitter",
        "totalEngagements": 342,
        "comments": 45,
        "shares": 78,
        "likes": 219,
        "recentComments": [
          {
            "id": "comment123",
            "user": {
              "name": "Jane Smith",
              "handle": "janesmith",
              "profileImage": "https://example.com/jane.jpg"
            },
            "content": "Great post! Looking forward to more content.",
            "timestamp": "2023-11-29T18:30:00Z",
            "postId": "post456",
            "responded": false
          }
        ]
      }
    ]
  }
  ```

## Caching Strategy
- **Metrics Data**:
  - Short-lived cache (5-15 minutes) for frequently accessed metrics
  - Long-lived cache (6 hours) for historical data
  - Distributed Redis cache for horizontal scaling
- **User Account Data**:
  - Short-lived cache (1 minute) with immediate invalidation on updates
- **Posts Data**:
  - Medium-lived cache (30 minutes) for published posts
  - No caching for scheduled posts (always fresh from database)

## Rate Limiting & API Quotas
- **Platform-specific limits**:
  - Twitter: 500 requests/15-min window per app
  - Facebook: Rate limits vary by endpoint
  - LinkedIn: 100 requests/day per user for some endpoints
  - Pinterest: Tiered rate limits based on app approval
- **Handling Rate Limits**:
  - Exponential backoff for retry logic
  - Priority queue for critical operations
  - Background job processing for non-urgent data syncs

## State Management
- **Authentication State**: Currently uses localStorage
- **Future Implementation**: Consider Redux or Context API for global state management
- **Dashboard Data**: Will require fetching from APIs and managing loading/error states
- **API Call States**: Loading, success, and error states for all data fetching operations

## Future Enhancements
1. Implement detailed analytics dashboards with charts
2. Add post creation and scheduling functionality
3. Develop social media account connection interfaces
4. Create engagement management tools (comment replies, message handling)
5. Add user settings and account management
6. Implement notifications system
7. Add bulk scheduling and content planning features
8. Implement A/B testing for social media posts 

## Expected User Interactions
1. View analytics data and export reports
2. Create and schedule new posts
3. Manage existing scheduled posts
4. Respond to engagement (comments, messages)
5. Connect/disconnect social media accounts
6. Configure account settings

## Testing Considerations
- Authentication and access control testing
- API integration tests
- Data visualization testing
- User interaction flows
- Responsive design testing (mobile, tablet, desktop)
- Error state handling
- Rate limit and quota exhaustion handling
- Platform-specific API changes and versioning 