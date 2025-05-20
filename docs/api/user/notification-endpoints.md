# Notification API

## Overview
The Notification API provides endpoints to manage user notification preferences, including email and desktop notifications for various system events. These endpoints enable users to customize their notification experience in the Marketing Automation Tool.

## Authentication
All endpoints require a valid JWT token in the Authorization header.

## Endpoints

### Get Notification Preferences

#### Endpoint
`GET /api/user/notification-preferences`

#### Authentication
Requires valid JWT token.

#### Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token in format: `Bearer {token}` |

### Query Parameters
None

### Response
#### Success Response
- Status Code: 200
```json
{
  "preferences": [
    {
      "id": "account_update",
      "type": "Account Update",
      "description": "Received when your account is modified",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "new_user_added",
      "type": "New User Added",
      "description": "Sent when new user is added",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "new_social_profile",
      "type": "New Social Profile Connected",
      "description": "Sent when new social profile is connected",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "new_post_created",
      "type": "New Post Created",
      "description": "Sent when new post created by user",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "approval_rejected",
      "type": "Approval Rejected",
      "description": "Sent when new approval is rejected by admin",
      "emailEnabled": true,
      "desktopEnabled": true
    },
    {
      "id": "new_approval_requested",
      "type": "New Approval Requested",
      "description": "Received when new post approval is requested",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "approval_approved",
      "type": "Approval Approved",
      "description": "Sent to the author when post is approved",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "profile_changed",
      "type": "Profile Changed",
      "description": "Sent to the author when profile is changed",
      "emailEnabled": true,
      "desktopEnabled": true
    }
  ],
  "updated_at": "2024-05-12T14:22:10Z"
}
```

#### Error Responses
- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Notification preferences not found"
}
```

#### Example Usage
```typescript
const getNotificationPreferences = async () => {
  try {
    const response = await fetch('/api/user/notification-preferences', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }
    
    const data = await response.json();
    return data.preferences;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};
```

### Update Notification Preferences

#### Endpoint
`PUT /api/user/notification-preferences`

#### Authentication
Requires valid JWT token.

#### Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token in format: `Bearer {token}` |
| Content-Type | string | Yes | Must be `application/json` |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| preferences | array | Yes | Array of notification preference objects |

#### Example Request Body
```json
{
  "preferences": [
    {
      "id": "account_update",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "new_user_added",
      "emailEnabled": false,
      "desktopEnabled": false
    },
    {
      "id": "approval_rejected",
      "emailEnabled": true,
      "desktopEnabled": true
    }
  ]
}
```

#### Response
#### Success Response
- Status Code: 200
```json
{
  "message": "Notification preferences updated successfully",
  "updated_at": "2024-05-12T16:43:21Z"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "Invalid preference format"
}
```

- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Notification preference not found"
}
```

#### Example Usage
```typescript
const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await fetch('/api/user/notification-preferences', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ preferences })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update notification preferences');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};
```

## Notes
- The API supports both email and desktop notification channels
- Some notification types may have default values that cannot be changed
- Notification preferences are applied immediately after update
- Desktop notifications require browser permission
- Email notifications are subject to the user's email verification status 

## Overview
The Notification API provides endpoints to manage user notification preferences, including email and desktop notifications for various system events. These endpoints enable users to customize their notification experience in the Marketing Automation Tool.

## Authentication
All endpoints require a valid JWT token in the Authorization header.

## Endpoints

### Get Notification Preferences

#### Endpoint
`GET /api/user/notification-preferences`

#### Authentication
Requires valid JWT token.

#### Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token in format: `Bearer {token}` |

### Query Parameters
None

### Response
#### Success Response
- Status Code: 200
```json
{
  "preferences": [
    {
      "id": "account_update",
      "type": "Account Update",
      "description": "Received when your account is modified",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "new_user_added",
      "type": "New User Added",
      "description": "Sent when new user is added",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "new_social_profile",
      "type": "New Social Profile Connected",
      "description": "Sent when new social profile is connected",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "new_post_created",
      "type": "New Post Created",
      "description": "Sent when new post created by user",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "approval_rejected",
      "type": "Approval Rejected",
      "description": "Sent when new approval is rejected by admin",
      "emailEnabled": true,
      "desktopEnabled": true
    },
    {
      "id": "new_approval_requested",
      "type": "New Approval Requested",
      "description": "Received when new post approval is requested",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "approval_approved",
      "type": "Approval Approved",
      "description": "Sent to the author when post is approved",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "profile_changed",
      "type": "Profile Changed",
      "description": "Sent to the author when profile is changed",
      "emailEnabled": true,
      "desktopEnabled": true
    }
  ],
  "updated_at": "2024-05-12T14:22:10Z"
}
```

#### Error Responses
- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Notification preferences not found"
}
```

#### Example Usage
```typescript
const getNotificationPreferences = async () => {
  try {
    const response = await fetch('/api/user/notification-preferences', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }
    
    const data = await response.json();
    return data.preferences;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};
```

### Update Notification Preferences

#### Endpoint
`PUT /api/user/notification-preferences`

#### Authentication
Requires valid JWT token.

#### Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token in format: `Bearer {token}` |
| Content-Type | string | Yes | Must be `application/json` |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| preferences | array | Yes | Array of notification preference objects |

#### Example Request Body
```json
{
  "preferences": [
    {
      "id": "account_update",
      "emailEnabled": true,
      "desktopEnabled": false
    },
    {
      "id": "new_user_added",
      "emailEnabled": false,
      "desktopEnabled": false
    },
    {
      "id": "approval_rejected",
      "emailEnabled": true,
      "desktopEnabled": true
    }
  ]
}
```

#### Response
#### Success Response
- Status Code: 200
```json
{
  "message": "Notification preferences updated successfully",
  "updated_at": "2024-05-12T16:43:21Z"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "Invalid preference format"
}
```

- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Notification preference not found"
}
```

#### Example Usage
```typescript
const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await fetch('/api/user/notification-preferences', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ preferences })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update notification preferences');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};
```

## Notes
- The API supports both email and desktop notification channels
- Some notification types may have default values that cannot be changed
- Notification preferences are applied immediately after update
- Desktop notifications require browser permission
- Email notifications are subject to the user's email verification status 