# Analyze Page API Documentation

## Overview
The Analyze page provides analytics data for social media accounts. Users can view metrics and analytics for multiple social media accounts, switch between different accounts, and view detailed analytics for specific time periods.

## Endpoints

### 1. Get User Accounts

#### Endpoint
`GET /api/accounts`

#### Authentication
Requires valid JWT token in Authorization header.

#### Response
```json
{
  "accounts": [
    {
      "id": "acc_123456",
      "name": "AIMDek Technologies",
      "platform": "twitter",
      "profileImage": "/images/page2/aimdek-logo.png",
      "handle": "@aimdektech",
      "isVerified": true
    }
  ]
}
```

### 2. Get Account Analytics

#### Endpoint
`GET /api/analytics/{accountId}`

#### Authentication
Requires valid JWT token in Authorization header.

#### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| timeRange | string | Yes | Time range for analytics (7d, 30d, 3m, 6m, 1y) |
| platform | string | No | Filter by platform (twitter, facebook, etc.) |

#### Response
```json
{
  "accountId": "acc_123456",
  "accountName": "AIMDek Technologies",
  "timeRange": "30d",
  "metrics": {
    "tweets": 12500,
    "likes": 40,
    "followers": 20,
    "engagements": 10000,
    "audienceGrowth": 10000,
    "audienceGrowthPercentage": 25
  },
  "topPosts": [
    {
      "id": "post_123456",
      "platform": "twitter",
      "content": "Post content here",
      "date": "2024-03-20T15:00:00Z",
      "likes": 120,
      "comments": 45,
      "shares": 67,
      "mediaUrl": "optional/media/url"
    }
  ]
}
```

### 3. Get Post Analytics

#### Endpoint
`GET /api/posts/{accountId}/analytics`

#### Authentication
Requires valid JWT token in Authorization header.

#### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| timeRange | string | Yes | Time range for analytics (7d, 30d, 3m, 6m, 1y) |
| platform | string | No | Filter by platform |
| sortBy | string | No | Sort by (engagement, likes, comments, shares) |
| limit | number | No | Number of posts to return (default: 10) |

#### Response
```json
{
  "posts": [
    {
      "id": "post_123456",
      "platform": "twitter",
      "content": "Post content",
      "date": "2024-03-20T15:00:00Z",
      "metrics": {
        "likes": 120,
        "comments": 45,
        "shares": 67,
        "totalEngagement": 232,
        "engagementRate": 2.3,
        "impressions": 5000,
        "reach": 4000
      },
      "mediaUrl": "optional/media/url"
    }
  ],
  "totalPosts": 150,
  "averageEngagement": 185.5
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions to access this account"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Account or resource not found"
}
```

## Rate Limits
- 1000 requests per hour per user
- 100 requests per minute per IP

## Notes
1. All timestamps are in ISO 8601 format
2. Analytics data is cached for 5 minutes
3. Historical data older than 1 year may have reduced granularity
4. Media URLs are signed and expire after 24 hours 