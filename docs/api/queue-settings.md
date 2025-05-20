# Queue Settings API

## Overview
API for managing preferred queue times for social media posting. These settings define when posts will be scheduled when using the "Preferred Queue Time" option in the post publisher.

## Endpoint
`GET /api/queue-settings`

## Authentication
JWT token with sufficient permissions required.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |
| Content-Type | string | Yes | application/json |

### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| accountId | string | Yes | Social account ID |

## Response
### Success Response
- Status Code: 200
```json
{
  "accountId": "twitter-account-123",
  "weekdaySettings": [
    {
      "day": "monday",
      "enabled": true,
      "timeSlots": [
        { "id": "mon-1", "time": "09:00" },
        { "id": "mon-2", "time": "12:30" },
        { "id": "mon-3", "time": "17:00" }
      ]
    },
    {
      "day": "tuesday",
      "enabled": true,
      "timeSlots": [
        { "id": "tue-1", "time": "10:00" },
        { "id": "tue-2", "time": "14:00" }
      ]
    },
    {
      "day": "wednesday",
      "enabled": true,
      "timeSlots": [
        { "id": "wed-1", "time": "09:30" },
        { "id": "wed-2", "time": "13:00" },
        { "id": "wed-3", "time": "16:30" }
      ]
    },
    {
      "day": "thursday",
      "enabled": true,
      "timeSlots": [
        { "id": "thu-1", "time": "09:00" },
        { "id": "thu-2", "time": "12:00" },
        { "id": "thu-3", "time": "15:00" },
        { "id": "thu-4", "time": "18:00" }
      ]
    },
    {
      "day": "friday",
      "enabled": true,
      "timeSlots": [
        { "id": "fri-1", "time": "10:00" },
        { "id": "fri-2", "time": "13:00" },
        { "id": "fri-3", "time": "16:00" }
      ]
    },
    {
      "day": "saturday",
      "enabled": false,
      "timeSlots": []
    },
    {
      "day": "sunday",
      "enabled": false,
      "timeSlots": []
    }
  ]
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Invalid request data",
  "details": ["accountId is required"]
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
  "message": "Insufficient permissions to access account settings"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Account not found"
}
```

## Example Usage
```typescript
const getQueueSettings = async (accountId) => {
  const response = await fetch(`/api/queue-settings?accountId=${accountId}`, {
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};
```

---

# Update Queue Settings API

## Overview
API for updating preferred queue times for social media posting.

## Endpoint
`PUT /api/queue-settings`

## Authentication
JWT token with sufficient permissions required.

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
// Type definitions
interface TimeSlot {
  id: string;
  time: string; // 24-hour format "HH:MM"
}

interface WeekdaySetting {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}
```

## Response
### Success Response
- Status Code: 200
```json
{
  "accountId": "twitter-account-123",
  "weekdaySettings": [
    {
      "day": "monday",
      "enabled": true,
      "timeSlots": [
        { "id": "mon-1", "time": "09:00" },
        { "id": "mon-2", "time": "12:30" },
        { "id": "mon-3", "time": "17:00" }
      ]
    },
    // ... other days
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
  "message": "Insufficient permissions to modify account settings"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Account not found"
}
```

## Example Usage
```typescript
const updateQueueSettings = async (queueSettings) => {
  const response = await fetch('/api/queue-settings', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accountId: "twitter-account-123",
      weekdaySettings: [
        {
          day: "monday",
          enabled: true,
          timeSlots: [
            { id: "mon-1", time: "09:00" },
            { id: "mon-2", time: "12:30" },
            { id: "mon-3", time: "17:00" }
          ]
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
- Queue settings are configured per social account
- Time slots are specified in 24-hour format ("HH:MM")
- Time zone is based on the user's account settings

---

# Next Queue Time API

## Overview
API for retrieving the next available queue time for a social media account.

## Endpoint
`GET /api/next-queue-time`

## Authentication
JWT token with sufficient permissions required.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |
| Content-Type | string | Yes | application/json |

### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| accountId | string | Yes | Social account ID |
| fromTime | ISO8601 | No | Reference time (defaults to current time) |

## Response
### Success Response
- Status Code: 200
```json
{
  "accountId": "twitter-account-123",
  "nextQueueTime": "2023-09-15T14:00:00Z",
  "day": "tuesday"
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Invalid request data",
  "details": ["accountId is required"]
}
```

- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Account not found or no queue times configured"
}
```

## Example Usage
```typescript
const getNextQueueTime = async (accountId) => {
  const response = await fetch(`/api/next-queue-time?accountId=${accountId}`, {
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};
```

## Notes
- This endpoint is used internally when scheduling posts with the "Preferred Queue Time" option
- If no queue times are configured or all days are disabled, returns a 404 error
- The response includes the day of the week to help with display purposes 