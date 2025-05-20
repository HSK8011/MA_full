# Post Publishing API

## Overview
API endpoints for creating, scheduling, and managing social media posts with support for different publishing options and approval workflows.

## Endpoint
`POST /api/posts/create`

## Authentication
JWT token with sufficient publishing permissions required.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |
| Content-Type | string | Yes | application/json |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| content | string | Yes | HTML content of the post |
| accountIds | string[] | Yes | Array of social account IDs to publish to |
| publishType | string | Yes | Type of publishing: 'now', 'scheduled', 'queue' |
| scheduledTime | ISO8601 | No | Required for scheduled posts |
| mediaAttachments | Media[] | No | Array of media objects to attach |

## Response
### Success Response
- Status Code: 201
```json
{
  "id": "post-123",
  "content": "<p>Post content with formatting</p>",
  "plainText": "Post content without formatting",
  "createdAt": "2023-09-15T14:30:00Z",
  "updatedAt": "2023-09-15T14:30:00Z",
  "scheduledTime": "2023-09-20T10:00:00Z",
  "status": "scheduled",
  "publishType": "scheduled",
  "authorId": "user-456",
  "accountIds": ["account-789", "account-012"],
  "mediaAttachments": [
    {
      "id": "media-345",
      "type": "image",
      "url": "https://example.com/image.jpg",
      "thumbnailUrl": "https://example.com/thumbnail.jpg",
      "size": 1024000,
      "width": 1200,
      "height": 800,
      "createdAt": "2023-09-15T14:29:00Z"
    }
  ]
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Invalid request data",
  "details": ["Content is required", "At least one accountId must be provided"]
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
  "message": "Insufficient permissions to publish posts"
}
```

## Example Usage
```typescript
const createPost = async (postData) => {
  const response = await fetch('/api/posts/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: "<p>Exciting announcement! Check out our new product.</p>",
      accountIds: ["twitter-account-123", "linkedin-account-456"],
      publishType: "scheduled",
      scheduledTime: "2023-09-20T10:00:00Z",
      mediaAttachments: [
        {
          id: "media-789",
          type: "image",
          url: "/uploads/product-image.jpg"
        }
      ]
    })
  });
  
  return response.json();
};
```

## Notes
- Team members creating posts with `publishType` of 'now' or 'scheduled' will have posts automatically set to 'pending_approval' status
- Admin users can bypass the approval workflow
- Post content should be validated for platform-specific constraints (character limits, etc.)
- Queue time settings are managed separately through the queue settings API

---

# Queue Settings API

## Overview
API for managing preferred queue times for social media posting.

## Endpoint
`PUT /api/queue-settings`

## Authentication
JWT token with admin permissions required.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |
| Content-Type | string | Yes | application/json |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| accountId | string | Yes | Social account ID |
| weekdaySettings | WeekdaySetting[] | Yes | Queue time settings for each day of the week |

```typescript
// WeekdaySetting type definition
interface WeekdaySetting {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  enabled: boolean;
  times: string[]; // Array of times in 24-hour format, e.g. ["09:00", "12:30", "15:45"]
}
```

## Response
### Success Response
- Status Code: 200
```json
{
  "accountId": "account-123",
  "weekdaySettings": [
    {
      "day": "monday",
      "enabled": true,
      "times": ["09:00", "12:30", "17:00"]
    },
    {
      "day": "tuesday",
      "enabled": true,
      "times": ["10:00", "14:00", "18:00"]
    },
    {
      "day": "wednesday",
      "enabled": true,
      "times": ["09:30", "13:00", "16:30"]
    },
    {
      "day": "thursday",
      "enabled": true,
      "times": ["09:00", "12:00", "15:00", "18:00"]
    },
    {
      "day": "friday",
      "enabled": true,
      "times": ["10:00", "13:00", "16:00"]
    },
    {
      "day": "saturday",
      "enabled": false,
      "times": []
    },
    {
      "day": "sunday",
      "enabled": false,
      "times": []
    }
  ],
  "updatedAt": "2023-09-15T11:23:00Z"
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Invalid request data",
  "details": ["Invalid time format", "Each day must have a valid configuration"]
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
  "message": "Admin permissions required to modify queue settings"
}
```

## Example Usage
```typescript
const updateQueueSettings = async (accountId, settings) => {
  const response = await fetch('/api/queue-settings', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accountId: "twitter-account-123",
      weekdaySettings: [
        {
          day: "monday",
          enabled: true,
          times: ["09:00", "12:30", "17:00"]
        },
        // ... other days
      ]
    })
  });
  
  return response.json();
};
```

## Notes
- When posts are added to the queue, they will be scheduled at the next available time slot
- If no time slots are available for a given day, the system will look for the next day with available slots
- Queue settings can be configured per social account
- Time slots should be specified in UTC time 