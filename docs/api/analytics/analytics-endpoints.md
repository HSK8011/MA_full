# Analytics API

## Overview

The Analytics API provides endpoints for retrieving performance metrics and engagement data for social media accounts connected to the Marketing Automation platform. These endpoints enable data visualization, performance tracking, and content analysis.

## Base URL

```
/api/analytics
```

## Authentication

All endpoints require authentication with a valid JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

The authenticated user must have the appropriate permissions to access analytics data.

## Endpoints

### 1. Get Analytics Accounts

Retrieves all social media accounts that the authenticated user has access to for analytics purposes.

#### Request

```
GET /api/analytics/accounts
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| platform | string | No | Filter by platform (twitter, facebook, instagram, linkedin) |
| status | string | No | Filter by status (active, inactive) |

#### Response

- Status Code: 200 OK

```json
{
  "accounts": [
    {
      "id": "acc_123456",
      "name": "AIMDek Technologies",
      "platform": "twitter",
      "username": "@aimdektech",
      "profileImageUrl": "https://example.com/profile/aimdek.jpg",
      "status": "active",
      "lastSyncedAt": "2023-11-15T10:30:00Z"
    },
    {
      "id": "acc_789012",
      "name": "AIMDek Technologies",
      "platform": "facebook",
      "username": "AIMDek Technologies",
      "profileImageUrl": "https://example.com/profile/aimdek_fb.jpg",
      "status": "active",
      "lastSyncedAt": "2023-11-15T10:35:00Z"
    }
  ]
}
```

### 2. Get Analytics Metrics

Retrieves summary metrics for a specific account for a given time range.

#### Request

```
GET /api/analytics/metrics
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| accountId | string | Yes | ID of the social media account |
| timeRange | string | Yes | Time range for metrics (7d, 30d, 90d, 180d, 365d) |
| tab | string | No | Specific tab/view to get metrics for (general, posts) |

#### Response

- Status Code: 200 OK

```json
{
  "accountId": "acc_123456",
  "accountName": "AIMDek Technologies",
  "platform": "twitter",
  "timeRange": "30d",
  "dateRange": {
    "start": "2023-10-20T00:00:00Z",
    "end": "2023-11-20T23:59:59Z"
  },
  "metrics": {
    "tweets": 12500,
    "likes": 40,
    "followers": 20,
    "followersChange": 5,
    "followersChangePercentage": 33.3,
    "engagements": 10000,
    "audienceGrowth": 10000
  },
  "graphData": {
    "followers": {
      "labels": ["Oct 20", "Oct 27", "Nov 3", "Nov 10", "Nov 17"],
      "data": [15, 16, 17, 18, 20]
    },
    "engagements": {
      "labels": ["Oct 20", "Oct 27", "Nov 3", "Nov 10", "Nov 17"],
      "data": [8200, 8600, 9100, 9500, 10000]
    }
  }
}
```

### 3. Get Top Posts

Retrieves the most engaged posts for a specific account for a given time range.

#### Request

```
GET /api/analytics/top-posts
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| accountId | string | Yes | ID of the social media account |
| timeRange | string | Yes | Time range for metrics (7d, 30d, 90d, 180d, 365d) |
| limit | number | No | Number of top posts to return (default: 5, max: 20) |
| sortBy | string | No | Sort criterion (likes, comments, shares, engagement) (default: engagement) |

#### Response

- Status Code: 200 OK

```json
{
  "accountId": "acc_123456",
  "timeRange": "30d",
  "posts": [
    {
      "id": "post_123456",
      "platform": "twitter",
      "content": "Data and Creativity 🧡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.",
      "createdAt": "2023-09-27T15:53:00Z",
      "metrics": {
        "likes": 120,
        "comments": 45,
        "shares": 67,
        "clicks": 230,
        "engagement": 462
      },
      "mediaUrl": "https://example.com/media/posts/image1.jpg",
      "url": "https://twitter.com/aimdektech/status/123456"
    },
    {
      "id": "post_789012",
      "platform": "twitter",
      "content": "Data and Creativity 🧡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.",
      "createdAt": "2023-09-27T15:53:00Z",
      "metrics": {
        "likes": 95,
        "comments": 38,
        "shares": 52,
        "clicks": 185,
        "engagement": 370
      },
      "mediaUrl": "https://example.com/media/posts/image2.jpg",
      "url": "https://twitter.com/aimdektech/status/789012"
    }
  ]
}
```

### 4. Get Engagement Breakdown

Retrieves detailed engagement data broken down by type for a specific account.

#### Request

```
GET /api/analytics/engagement-breakdown
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| accountId | string | Yes | ID of the social media account |
| timeRange | string | Yes | Time range for metrics (7d, 30d, 90d, 180d, 365d) |

#### Response

- Status Code: 200 OK

```json
{
  "accountId": "acc_123456",
  "timeRange": "30d",
  "engagementTypes": {
    "likes": {
      "count": 3200,
      "percentage": 32
    },
    "comments": {
      "count": 1500,
      "percentage": 15
    },
    "shares": {
      "count": 1200,
      "percentage": 12
    },
    "clicks": {
      "count": 4100,
      "percentage": 41
    }
  },
  "graphData": {
    "labels": ["Likes", "Comments", "Shares", "Clicks"],
    "data": [3200, 1500, 1200, 4100]
  }
}
```

### 5. Get Audience Demographics

Retrieves audience demographic information for a specific account.

#### Request

```
GET /api/analytics/audience-demographics
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| accountId | string | Yes | ID of the social media account |

#### Response

- Status Code: 200 OK

```json
{
  "accountId": "acc_123456",
  "demographics": {
    "gender": {
      "male": 45,
      "female": 52,
      "other": 3
    },
    "ageRanges": {
      "13-17": 2,
      "18-24": 15,
      "25-34": 35,
      "35-44": 28,
      "45-54": 12,
      "55-64": 6,
      "65+": 2
    },
    "topCountries": [
      {"name": "United States", "percentage": 40},
      {"name": "India", "percentage": 25},
      {"name": "United Kingdom", "percentage": 10},
      {"name": "Canada", "percentage": 8},
      {"name": "Australia", "percentage": 5}
    ],
    "topCities": [
      {"name": "New York", "percentage": 12},
      {"name": "London", "percentage": 8},
      {"name": "Mumbai", "percentage": 7},
      {"name": "Toronto", "percentage": 5},
      {"name": "Sydney", "percentage": 4}
    ]
  }
}
```

## Error Responses

### Common Error Codes

- **400 Bad Request**: Invalid or missing required parameters
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User does not have permission to access the requested analytics
- **404 Not Found**: Specified account or resource not found
- **429 Too Many Requests**: Rate limit exceeded

### Example Error Response

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access analytics for this account",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

## Platform-Specific Considerations

### Twitter Analytics

- Tweet metrics include retweets, quotes, and replies
- Follower metrics include follower demographics if available
- Rate limits are subject to Twitter API constraints

### Facebook Analytics

- Post metrics include reactions broken down by type
- Page insights include reach and impression data
- Demographic data may be limited for pages with small audiences

### Instagram Analytics

- Post metrics include saves and profile visits
- Story metrics include exits and forwards
- Only available for business and creator accounts

### LinkedIn Analytics

- Post metrics include impressions and click-through rates
- Follower metrics include industry and job position if available
- Company page insights may include additional metrics

## Data Refreshing

Analytics data is refreshed according to the following schedule:
- Twitter data: Every 15 minutes
- Facebook data: Every 30 minutes
- Instagram data: Every 30 minutes
- LinkedIn data: Every hour

Historical data older than 24 hours is cached and refreshed daily.

## Rate Limiting

These endpoints are subject to rate limiting:
- 100 requests per minute for GET operations

Exceeding these limits will result in a 429 Too Many Requests response.

## Data Retention

Analytics data is retained according to the following policy:
- Detailed metrics: 13 months
- Aggregated metrics: 3 years
- Top content data: 2 years 

## Overview

The Analytics API provides endpoints for retrieving performance metrics and engagement data for social media accounts connected to the Marketing Automation platform. These endpoints enable data visualization, performance tracking, and content analysis.

## Base URL

```
/api/analytics
```

## Authentication

All endpoints require authentication with a valid JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

The authenticated user must have the appropriate permissions to access analytics data.

## Endpoints

### 1. Get Analytics Accounts

Retrieves all social media accounts that the authenticated user has access to for analytics purposes.

#### Request

```
GET /api/analytics/accounts
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| platform | string | No | Filter by platform (twitter, facebook, instagram, linkedin) |
| status | string | No | Filter by status (active, inactive) |

#### Response

- Status Code: 200 OK

```json
{
  "accounts": [
    {
      "id": "acc_123456",
      "name": "AIMDek Technologies",
      "platform": "twitter",
      "username": "@aimdektech",
      "profileImageUrl": "https://example.com/profile/aimdek.jpg",
      "status": "active",
      "lastSyncedAt": "2023-11-15T10:30:00Z"
    },
    {
      "id": "acc_789012",
      "name": "AIMDek Technologies",
      "platform": "facebook",
      "username": "AIMDek Technologies",
      "profileImageUrl": "https://example.com/profile/aimdek_fb.jpg",
      "status": "active",
      "lastSyncedAt": "2023-11-15T10:35:00Z"
    }
  ]
}
```

### 2. Get Analytics Metrics

Retrieves summary metrics for a specific account for a given time range.

#### Request

```
GET /api/analytics/metrics
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| accountId | string | Yes | ID of the social media account |
| timeRange | string | Yes | Time range for metrics (7d, 30d, 90d, 180d, 365d) |
| tab | string | No | Specific tab/view to get metrics for (general, posts) |

#### Response

- Status Code: 200 OK

```json
{
  "accountId": "acc_123456",
  "accountName": "AIMDek Technologies",
  "platform": "twitter",
  "timeRange": "30d",
  "dateRange": {
    "start": "2023-10-20T00:00:00Z",
    "end": "2023-11-20T23:59:59Z"
  },
  "metrics": {
    "tweets": 12500,
    "likes": 40,
    "followers": 20,
    "followersChange": 5,
    "followersChangePercentage": 33.3,
    "engagements": 10000,
    "audienceGrowth": 10000
  },
  "graphData": {
    "followers": {
      "labels": ["Oct 20", "Oct 27", "Nov 3", "Nov 10", "Nov 17"],
      "data": [15, 16, 17, 18, 20]
    },
    "engagements": {
      "labels": ["Oct 20", "Oct 27", "Nov 3", "Nov 10", "Nov 17"],
      "data": [8200, 8600, 9100, 9500, 10000]
    }
  }
}
```

### 3. Get Top Posts

Retrieves the most engaged posts for a specific account for a given time range.

#### Request

```
GET /api/analytics/top-posts
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| accountId | string | Yes | ID of the social media account |
| timeRange | string | Yes | Time range for metrics (7d, 30d, 90d, 180d, 365d) |
| limit | number | No | Number of top posts to return (default: 5, max: 20) |
| sortBy | string | No | Sort criterion (likes, comments, shares, engagement) (default: engagement) |

#### Response

- Status Code: 200 OK

```json
{
  "accountId": "acc_123456",
  "timeRange": "30d",
  "posts": [
    {
      "id": "post_123456",
      "platform": "twitter",
      "content": "Data and Creativity 🧡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.",
      "createdAt": "2023-09-27T15:53:00Z",
      "metrics": {
        "likes": 120,
        "comments": 45,
        "shares": 67,
        "clicks": 230,
        "engagement": 462
      },
      "mediaUrl": "https://example.com/media/posts/image1.jpg",
      "url": "https://twitter.com/aimdektech/status/123456"
    },
    {
      "id": "post_789012",
      "platform": "twitter",
      "content": "Data and Creativity 🧡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.",
      "createdAt": "2023-09-27T15:53:00Z",
      "metrics": {
        "likes": 95,
        "comments": 38,
        "shares": 52,
        "clicks": 185,
        "engagement": 370
      },
      "mediaUrl": "https://example.com/media/posts/image2.jpg",
      "url": "https://twitter.com/aimdektech/status/789012"
    }
  ]
}
```

### 4. Get Engagement Breakdown

Retrieves detailed engagement data broken down by type for a specific account.

#### Request

```
GET /api/analytics/engagement-breakdown
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| accountId | string | Yes | ID of the social media account |
| timeRange | string | Yes | Time range for metrics (7d, 30d, 90d, 180d, 365d) |

#### Response

- Status Code: 200 OK

```json
{
  "accountId": "acc_123456",
  "timeRange": "30d",
  "engagementTypes": {
    "likes": {
      "count": 3200,
      "percentage": 32
    },
    "comments": {
      "count": 1500,
      "percentage": 15
    },
    "shares": {
      "count": 1200,
      "percentage": 12
    },
    "clicks": {
      "count": 4100,
      "percentage": 41
    }
  },
  "graphData": {
    "labels": ["Likes", "Comments", "Shares", "Clicks"],
    "data": [3200, 1500, 1200, 4100]
  }
}
```

### 5. Get Audience Demographics

Retrieves audience demographic information for a specific account.

#### Request

```
GET /api/analytics/audience-demographics
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| accountId | string | Yes | ID of the social media account |

#### Response

- Status Code: 200 OK

```json
{
  "accountId": "acc_123456",
  "demographics": {
    "gender": {
      "male": 45,
      "female": 52,
      "other": 3
    },
    "ageRanges": {
      "13-17": 2,
      "18-24": 15,
      "25-34": 35,
      "35-44": 28,
      "45-54": 12,
      "55-64": 6,
      "65+": 2
    },
    "topCountries": [
      {"name": "United States", "percentage": 40},
      {"name": "India", "percentage": 25},
      {"name": "United Kingdom", "percentage": 10},
      {"name": "Canada", "percentage": 8},
      {"name": "Australia", "percentage": 5}
    ],
    "topCities": [
      {"name": "New York", "percentage": 12},
      {"name": "London", "percentage": 8},
      {"name": "Mumbai", "percentage": 7},
      {"name": "Toronto", "percentage": 5},
      {"name": "Sydney", "percentage": 4}
    ]
  }
}
```

## Error Responses

### Common Error Codes

- **400 Bad Request**: Invalid or missing required parameters
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User does not have permission to access the requested analytics
- **404 Not Found**: Specified account or resource not found
- **429 Too Many Requests**: Rate limit exceeded

### Example Error Response

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access analytics for this account",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

## Platform-Specific Considerations

### Twitter Analytics

- Tweet metrics include retweets, quotes, and replies
- Follower metrics include follower demographics if available
- Rate limits are subject to Twitter API constraints

### Facebook Analytics

- Post metrics include reactions broken down by type
- Page insights include reach and impression data
- Demographic data may be limited for pages with small audiences

### Instagram Analytics

- Post metrics include saves and profile visits
- Story metrics include exits and forwards
- Only available for business and creator accounts

### LinkedIn Analytics

- Post metrics include impressions and click-through rates
- Follower metrics include industry and job position if available
- Company page insights may include additional metrics

## Data Refreshing

Analytics data is refreshed according to the following schedule:
- Twitter data: Every 15 minutes
- Facebook data: Every 30 minutes
- Instagram data: Every 30 minutes
- LinkedIn data: Every hour

Historical data older than 24 hours is cached and refreshed daily.

## Rate Limiting

These endpoints are subject to rate limiting:
- 100 requests per minute for GET operations

Exceeding these limits will result in a 429 Too Many Requests response.

## Data Retention

Analytics data is retained according to the following policy:
- Detailed metrics: 13 months
- Aggregated metrics: 3 years
- Top content data: 2 years 