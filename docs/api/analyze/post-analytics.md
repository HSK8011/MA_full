# Post Analytics API

## Overview
The Post Analytics API provides detailed metrics and performance data for individual social media posts. This API powers the "Posts" tab in the Analyze page, allowing users to view and filter analytics for their social media content.

## Endpoints

### Get Top Posts

#### Endpoint
`GET /api/posts/top/{accountId}`

#### Authentication
Requires valid JWT token in Authorization header.

#### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| timeRange | string | Yes | Time range (7d, 30d, 3m, 6m, 1y) |
| platform | string | No | Filter by platform |
| sortBy | string | No | Sort by (engagement, likes, comments, shares), default: engagement |
| limit | number | No | Number of posts to return (default: 10, max: 50) |

#### Response
```json
{
  "posts": [
    {
      "id": "post_123456",
      "platform": "twitter",
      "content": "Data and Creativity 🧡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign.",
      "date": "2023-03-15T15:53:00Z",
      "likes": 120,
      "comments": 45,
      "shares": 67,
      "engagementRate": 4.8,
      "impressions": 5432,
      "clicks": 87,
      "mediaUrl": "/images/posts/post_123456.jpg",
      "mediaType": "image"
    },
    {
      "id": "post_789012",
      "platform": "facebook",
      "content": "Excited to announce our new product launch! #ProductLaunch #Innovation",
      "date": "2023-03-10T12:30:00Z",
      "likes": 350,
      "comments": 62,
      "shares": 118,
      "engagementRate": 7.2,
      "impressions": 8750,
      "clicks": 145,
      "mediaUrl": "/videos/posts/post_789012.mp4",
      "mediaType": "video"
    }
  ],
  "totalPosts": 217,
  "pagination": {
    "currentPage": 1,
    "totalPages": 22,
    "nextPage": "/api/posts/top/acc_123456?timeRange=30d&page=2&limit=10"
  }
}
```

### Get Single Post Analytics

#### Endpoint
`GET /api/posts/{postId}/analytics`

#### Authentication
Requires valid JWT token in Authorization header.

#### Response
```json
{
  "id": "post_123456",
  "accountId": "acc_123456",
  "platform": "twitter",
  "content": "Data and Creativity 🧡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign.",
  "date": "2023-03-15T15:53:00Z",
  "metrics": {
    "likes": 120,
    "comments": 45,
    "shares": 67,
    "totalEngagement": 232,
    "engagementRate": 4.8,
    "impressions": 5432,
    "reach": 4750,
    "clicks": 87,
    "profileVisits": 28,
    "saves": 15,
    "videoViews": null,
    "averageWatchTime": null
  },
  "demographics": {
    "genderDistribution": {
      "male": 58,
      "female": 40,
      "other": 2
    },
    "ageDistribution": {
      "13-17": 5,
      "18-24": 22,
      "25-34": 38,
      "35-44": 25,
      "45-54": 7,
      "55+": 3
    },
    "topLocations": [
      {"name": "United States", "percentage": 45},
      {"name": "United Kingdom", "percentage": 15},
      {"name": "Canada", "percentage": 12},
      {"name": "Australia", "percentage": 8},
      {"name": "Other", "percentage": 20}
    ]
  },
  "mediaDetails": {
    "url": "/images/posts/post_123456.jpg",
    "type": "image",
    "dimensions": "1200x800",
    "fileSize": "450KB"
  }
}
```

### Get Post Performance Over Time

#### Endpoint
`GET /api/posts/{postId}/timeseries`

#### Authentication
Requires valid JWT token in Authorization header.

#### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| metric | string | Yes | Metric to track (impressions, engagement, clicks) |
| timeGranularity | string | No | Time granularity (hourly, daily), default depends on post age |

#### Response
```json
{
  "postId": "post_123456",
  "metric": "impressions",
  "timeGranularity": "hourly",
  "data": [
    {"timestamp": "2023-03-15T16:00:00Z", "value": 843},
    {"timestamp": "2023-03-15T17:00:00Z", "value": 1205},
    {"timestamp": "2023-03-15T18:00:00Z", "value": 962},
    {"timestamp": "2023-03-15T19:00:00Z", "value": 754},
    {"timestamp": "2023-03-15T20:00:00Z", "value": 623},
    {"timestamp": "2023-03-15T21:00:00Z", "value": 432},
    {"timestamp": "2023-03-15T22:00:00Z", "value": 305},
    {"timestamp": "2023-03-15T23:00:00Z", "value": 208}
  ]
}
```

## Post Comparison

### Compare Posts

#### Endpoint
`GET /api/posts/compare`

#### Authentication
Requires valid JWT token in Authorization header.

#### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| postIds | string | Yes | Comma-separated list of post IDs to compare |
| metrics | string | Yes | Comma-separated list of metrics to include |

#### Response
```json
{
  "posts": [
    {
      "id": "post_123456",
      "platform": "twitter",
      "date": "2023-03-15T15:53:00Z",
      "content": "Data and Creativity 🧡 The dynamic duo...",
      "metrics": {
        "impressions": 5432,
        "engagement": 232,
        "engagementRate": 4.8
      }
    },
    {
      "id": "post_789012",
      "platform": "twitter",
      "date": "2023-03-10T12:30:00Z",
      "content": "Excited to announce our new product...",
      "metrics": {
        "impressions": 8750,
        "engagement": 530,
        "engagementRate": 6.1
      }
    }
  ],
  "differences": {
    "impressions": 3318,
    "engagement": 298,
    "engagementRate": 1.3
  }
}
```

## Post Analytics Filters

The Posts tab in the Analyze section allows filtering posts by various criteria:

1. **Content Type**
   - Text only
   - Image
   - Video
   - Link
   - Poll

2. **Performance**
   - High performing (top 10%)
   - Average (middle 80%)
   - Low performing (bottom 10%)

3. **Engagement Type**
   - High likes
   - High comments
   - High shares

4. **Post Schedule**
   - Time of day
   - Day of week
   - Month

## Error Responses

### Post Not Found
```json
{
  "error": "Not Found",
  "message": "Post not found or has been deleted",
  "code": "POST_NOT_FOUND"
}
```

### Analytics Not Available
```json
{
  "error": "Analytics Unavailable",
  "message": "Analytics for this post are not yet available or have expired",
  "code": "ANALYTICS_UNAVAILABLE"
}
```

## Best Practices

1. **Data Freshness**: Post analytics are typically updated every 15 minutes for the first 24 hours, then hourly for the first week, and daily thereafter.

2. **Data Retention**: Detailed post analytics are available for 90 days. After that, only aggregated metrics are maintained.

3. **Rate Limiting**: The post analytics API has a lower rate limit than general account analytics:
   - 100 requests per minute per user
   - 1000 requests per hour per user 