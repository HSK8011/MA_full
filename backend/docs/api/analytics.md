# Analytics API Documentation

This document outlines the Analytics API endpoints for retrieving social media analytics data for both individual accounts and across all connected accounts.

## Authentication

All analytics endpoints require authentication. Include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Base URL

```
/api/analytics
```

## Endpoints

### Get Analytics Overview

Retrieve analytics data aggregated across all connected social media accounts.

**Endpoint:** `GET /api/analytics`

**Query Parameters:**

| Parameter | Type   | Required | Description                                        |
|-----------|--------|----------|-------------------------------------------------|
| timeRange | string | No       | Time range for analytics (default: '30d'). Options: '7d', '30d', '90d' |

**Response:**

```json
{
  "timeRange": "30d",
  "metrics": {
    "posts": 42,
    "likes": 1250,
    "followers": 5000,
    "engagements": 1800,
    "audienceGrowth": 120,
    "audienceGrowthPercentage": 2.5,
    "impressions": 8500,
    "reach": 6200,
    "shares": 320,
    "comments": 180,
    "clicks": 420,
    "profileViews": 950
  },
  "accounts": [
    {
      "id": "integration_id_1",
      "name": "Account Name",
      "platform": "instagram",
      "profileImage": "/images/page2/instagram-icon.png"
    }
  ],
  "topPosts": [
    {
      "id": "post_id_1",
      "platform": "instagram",
      "content": "Post content here...",
      "date": "2023-05-15T12:00:00Z",
      "likes": 250,
      "comments": 42,
      "shares": 15,
      "mediaUrls": ["https://example.com/image.jpg"],
      "accountId": "integration_id_1",
      "accountName": "Account Name",
      "status": "published"
    },
    {
      "id": "post_id_2",
      "platform": "instagram",
      "content": "Another post content...",
      "date": "2023-05-10T10:30:00Z",
      "likes": 0,
      "comments": 0,
      "shares": 0,
      "mediaUrls": ["https://example.com/image2.jpg"],
      "accountId": "integration_id_1",
      "accountName": "Account Name",
      "status": "scheduled",
      "scheduledAt": "2023-06-01T09:00:00Z"
    }
  ]
}
```

**Error Responses:**

| Status Code | Description                   | Response                                           |
|-------------|-------------------------------|----------------------------------------------------|
| 401         | Unauthorized                  | `{ "message": "Unauthorized - User ID not found", "code": "USER_ID_MISSING" }` |
| 404         | No connected integrations     | `{ "message": "No connected integrations found", "code": "NO_INTEGRATIONS" }` |

### Get Account Analytics

Retrieve analytics data for a specific social media account.

**Endpoint:** `GET /api/analytics/:integrationId/:timeRange?`

**URL Parameters:**

| Parameter    | Type   | Required | Description                                        |
|--------------|--------|----------|-------------------------------------------------|
| integrationId | string | Yes      | ID of the integration/account                     |
| timeRange    | string | No       | Time range for analytics (default: '30d'). Options: '7d', '30d', '90d' |

**Response:**

```json
{
  "accountId": "integration_id_1",
  "accountName": "Account Name",
  "platform": "instagram",
  "timeRange": "30d",
  "metrics": {
    "posts": 15,
    "likes": 450,
    "followers": 2200,
    "engagements": 620,
    "audienceGrowth": 50,
    "audienceGrowthPercentage": 2.3,
    "impressions": 3200,
    "reach": 2100,
    "shares": 85,
    "comments": 65,
    "clicks": 120,
    "profileViews": 310
  },
  "topPosts": [
    {
      "id": "post_id_1",
      "platform": "instagram",
      "content": "Post content here...",
      "date": "2023-05-15T12:00:00Z",
      "likes": 250,
      "comments": 42,
      "shares": 15,
      "mediaUrls": ["https://example.com/image.jpg"],
      "status": "published"
    },
    {
      "id": "post_id_2",
      "platform": "instagram",
      "content": "Draft post content...",
      "date": null,
      "likes": 0,
      "comments": 0,
      "shares": 0,
      "mediaUrls": ["https://example.com/image2.jpg"],
      "status": "draft"
    },
    {
      "id": "post_id_3",
      "platform": "instagram",
      "content": "Scheduled post content...",
      "date": null,
      "likes": 0,
      "comments": 0,
      "shares": 0,
      "mediaUrls": ["https://example.com/image3.jpg"],
      "status": "scheduled",
      "scheduledAt": "2023-06-01T09:00:00Z"
    }
  ]
}
```

**Error Responses:**

| Status Code | Description                   | Response                                           |
|-------------|-------------------------------|----------------------------------------------------|
| 401         | Unauthorized                  | `{ "message": "Unauthorized - User ID not found", "code": "USER_ID_MISSING" }` |
| 404         | Integration not found         | `{ "message": "Integration not found", "code": "INTEGRATION_NOT_FOUND" }` |
| 404         | Analytics data not found      | `{ "message": "Analytics data not found", "code": "ANALYTICS_NOT_FOUND" }` |

## Data Models

### AnalyticsMetrics

| Field                    | Type   | Description                                        |
|--------------------------|--------|-------------------------------------------------|
| posts                    | number | Total number of posts                             |
| likes                    | number | Total number of likes                             |
| followers                | number | Total number of followers                         |
| engagements              | number | Total number of engagements                       |
| audienceGrowth           | number | Absolute audience growth in the time period       |
| audienceGrowthPercentage | number | Percentage audience growth in the time period     |
| impressions              | number | Total number of impressions                       |
| reach                    | number | Total reach                                       |
| shares                   | number | Total number of shares                            |
| comments                 | number | Total number of comments                          |
| clicks                   | number | Total number of clicks                            |
| profileViews             | number | Total number of profile views                     |

### TopPost

| Field        | Type   | Description                                        |
|--------------|--------|-------------------------------------------------|
| id           | string | Unique post ID                                    |
| platform     | string | Social media platform (e.g., 'instagram')         |
| content      | string | Post content/caption                              |
| date         | string | Publication date (ISO format)                     |
| likes        | number | Number of likes                                   |
| comments     | number | Number of comments                                |
| shares       | number | Number of shares                                  |
| mediaUrls    | array  | Array of media URLs associated with the post      |
| accountId    | string | ID of the account that created the post (overview only) |
| accountName  | string | Name of the account that created the post (overview only) |
| status       | string | Post status: 'published', 'scheduled', or 'draft' |
| scheduledAt  | string | Scheduled publication date for scheduled posts (ISO format) |

### Account

| Field        | Type   | Description                                        |
|--------------|--------|-------------------------------------------------|
| id           | string | Unique integration/account ID                     |
| name         | string | Account name or username                          |
| platform     | string | Social media platform (e.g., 'instagram')         |
| profileImage | string | URL to the account's profile image                |

## Frontend Service

The frontend interacts with these endpoints through the `analyticsService` which provides the following methods:

### getAnalyticsOverview

```typescript
getAnalyticsOverview(timeRange: string = '30d'): Promise<AnalyticsOverview>
```

Retrieves analytics data aggregated across all connected accounts.

### getAccountAnalytics

```typescript
getAccountAnalytics(accountId: string, timeRange: string = '30d'): Promise<AccountAnalytics>
```

Retrieves analytics data for a specific account.