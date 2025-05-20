# Schedule Post API

## Overview
The Schedule Post API allows users to create and schedule social media posts across different platforms. This API provides functionality for composing posts with rich text editing, scheduling them at specific times, and previewing how they will appear on social media platforms.

## Endpoint
`POST /api/publish/schedule-post`
`GET /api/publish/schedule-post/:id`
`PUT /api/publish/schedule-post/:id`
`DELETE /api/publish/schedule-post/:id`

## Authentication
Requires valid JWT token in the Authorization header.

## Request Parameters

### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |
| Content-Type | string | Yes | application/json |

### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| id | string | No | Post ID (for GET, PUT, DELETE requests) |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| content | string | Yes | Post content with HTML formatting |
| accountId | string | Yes | Social media account ID to post to |
| scheduledTimes | array | Yes | Array of scheduled posting times |
| scheduledTimes[].date | ISO8601 | Yes | Scheduled date |
| scheduledTimes[].time | string | Yes | Scheduled time |
| scheduledTimes[].period | string | Yes | AM or PM |
| postType | string | Yes | Type of scheduling ('now', 'specific', 'queue') |
| mediaUrls | array | No | Array of media URLs to attach to the post |
| tags | array | No | Array of hashtags or mentions |

## Response

### Success Response
- Status Code: 201
```json
{
  "id": "post-123456",
  "content": "The three greatest things you learn from travelling...",
  "account": {
    "id": "acc_123",
    "name": "AIMDek Technologies",
    "platform": "twitter"
  },
  "scheduledTimes": [
    {
      "date": "2023-09-23T00:00:00Z",
      "time": "12",
      "period": "PM"
    }
  ],
  "status": "scheduled",
  "createdAt": "2023-08-15T10:30:00Z"
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Invalid request",
  "details": ["Content is required", "Account ID is required"]
}
```

- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

- Status Code: 403
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions to schedule posts"
}
```

- Status Code: 429
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "retryAfter": 60
}
```

## Example Usage
```typescript
// Schedule a post for a specific time
const schedulePost = async () => {
  const response = await fetch('/api/publish/schedule-post', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: '<p>The three greatest things you learn from travelling</p><p>Like all the great things on earth travelling teaches us by example.</p>',
      accountId: 'twitter_123456',
      postType: 'specific',
      scheduledTimes: [
        {
          date: '2023-09-23T00:00:00Z',
          time: '12',
          period: 'PM'
        }
      ]
    })
  });
  
  const data = await response.json();
  return data;
};
```

## Notes
1. Rich text content is supported using HTML formatting
2. Images can be uploaded separately using the Media Upload API and referenced in the `mediaUrls` array
3. There is a limit of 10 scheduled posts per account at any given time
4. Posts can be rescheduled by updating an existing post with new schedule times
5. Character limits are enforced based on the target platform (e.g., 280 for Twitter)
6. Content moderation checks are performed before scheduling 