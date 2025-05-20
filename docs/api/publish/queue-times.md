# Queue Times API

## Overview
The Queue Times API manages scheduling settings for social media posts, allowing users to configure default posting times and reshare delivered content. This API is particularly important for automated content scheduling and recycling previously successful posts.

## Endpoint
`GET /api/publish/queue-times`
`POST /api/publish/queue-times`
`PUT /api/publish/queue-times/:id`
`DELETE /api/publish/queue-times/:id`

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
| platform | string | No | Filter queue times by platform (twitter, facebook, instagram, linkedin, etc.) |
| accountId | string | No | Filter queue times by specific social account ID |

### Body Parameters (POST/PUT)
| Name | Type | Required | Description |
|---|---|----|----|
| platform | string | Yes | Social platform (twitter, facebook, linkedin, etc.) |
| accountId | string | Yes | ID of the social account |
| dayOfWeek | number | Yes | Day of week (0-6, where 0 is Sunday) |
| times | string[] | Yes | Array of times in 24-hour format (HH:MM) |
| timezone | string | Yes | Timezone in IANA format (e.g., "America/New_York") |
| active | boolean | No | Whether this queue time is active (default: true) |
| postId | string | No | ID of a delivered post to reshare (used when redirected from DeliveredPosts) |

## Response

### Success Response (GET)
- Status Code: 200
```json
{
  "queueTimes": [
    {
      "id": "qt_123",
      "platform": "twitter",
      "accountId": "acc_1",
      "dayOfWeek": 1,
      "times": ["09:00", "12:30", "16:00"],
      "timezone": "America/New_York",
      "active": true,
      "createdAt": "2023-05-15T10:30:00Z",
      "updatedAt": "2023-06-20T14:45:00Z"
    },
    {
      "id": "qt_124",
      "platform": "facebook",
      "accountId": "acc_2",
      "dayOfWeek": 2,
      "times": ["10:00", "15:00", "19:30"],
      "timezone": "America/Los_Angeles",
      "active": true,
      "createdAt": "2023-05-15T10:35:00Z",
      "updatedAt": "2023-06-21T11:20:00Z"
    }
  ]
}
```

### Success Response (POST)
- Status Code: 201
```json
{
  "id": "qt_125",
  "platform": "instagram",
  "accountId": "acc_3",
  "dayOfWeek": 3,
  "times": ["11:00", "14:00", "17:30"],
  "timezone": "Europe/London",
  "active": true,
  "createdAt": "2023-07-10T09:15:00Z",
  "updatedAt": "2023-07-10T09:15:00Z"
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "Invalid queue time data",
  "details": ["Times must be in HH:MM format"]
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
  "message": "Insufficient permissions to manage queue times"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Queue time not found"
}
```

## Example Usage

### Getting Queue Times
```typescript
const getQueueTimes = async () => {
  const response = await fetch('/api/publish/queue-times', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch queue times');
  }
  
  return await response.json();
};
```

### Adding a New Queue Time
```typescript
const addQueueTime = async (queueTimeData) => {
  const response = await fetch('/api/publish/queue-times', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(queueTimeData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add queue time');
  }
  
  return await response.json();
};
```

### Resharing a Post to Queue
```typescript
const resharePostToQueue = async (postId, queueSettings) => {
  const response = await fetch('/api/publish/queue-times', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId,
      ...queueSettings
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to reshare post to queue');
  }
  
  return await response.json();
};
```

## Notes
- Queue times are specific to each platform and account combination
- When resharing content from the DeliveredPosts component, the system will navigate users to this queue-times view
- A single queue time entry represents a specific day and time slot for posting
- Multiple times can be specified for each day
- All times are stored in the specified timezone
- Changes to queue times take effect for future scheduled posts only 