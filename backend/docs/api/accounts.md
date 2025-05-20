# Social Media Accounts API Documentation

## Connect Social Account
Connects a new social media account.

**URL**: `/api/accounts/connect`
**Method**: `POST`
**Auth Required**: Yes

**Request Body**:
```json
{
  "platform": "string",  // "twitter", "facebook", "instagram", "linkedin"
  "accessToken": "string",
  "refreshToken": "string",
  "profileData": {
    "username": "string",
    "profileImage": "string",
    "displayName": "string"
  }
}
```

**Success Response (201 Created)**:
```json
{
  "message": "Account connected successfully",
  "account": {
    "id": "string",
    "platform": "string",
    "username": "string",
    "profileImage": "string",
    "isActive": true,
    "connectedAt": "string"
  }
}
```

## List Connected Accounts
Lists all connected social media accounts.

**URL**: `/api/accounts`
**Method**: `GET`
**Auth Required**: Yes

**Query Parameters**:
- `platform`: string (optional) - Filter by platform
- `status`: string (optional) - "active" or "inactive"

**Success Response (200 OK)**:
```json
{
  "accounts": [
    {
      "id": "string",
      "platform": "string",
      "username": "string",
      "profileImage": "string",
      "isActive": boolean,
      "connectedAt": "string",
      "lastSyncedAt": "string",
      "metrics": {
        "followers": number,
        "following": number,
        "posts": number
      }
    }
  ]
}
```

## Get Account Details
Get detailed information about a specific connected account.

**URL**: `/api/accounts/:accountId`
**Method**: `GET`
**Auth Required**: Yes

**Success Response (200 OK)**:
```json
{
  "account": {
    "id": "string",
    "platform": "string",
    "username": "string",
    "profileImage": "string",
    "isActive": boolean,
    "connectedAt": "string",
    "lastSyncedAt": "string",
    "metrics": {
      "followers": number,
      "following": number,
      "posts": number
    },
    "settings": {
      "autoPost": boolean,
      "scheduleEnabled": boolean,
      "notificationsEnabled": boolean
    }
  }
}
```

## Update Account Settings
Updates settings for a connected account.

**URL**: `/api/accounts/:accountId/settings`
**Method**: `PUT`
**Auth Required**: Yes

**Request Body**:
```json
{
  "settings": {
    "autoPost": boolean,
    "scheduleEnabled": boolean,
    "notificationsEnabled": boolean
  }
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Account settings updated successfully",
  "settings": {
    "autoPost": boolean,
    "scheduleEnabled": boolean,
    "notificationsEnabled": boolean
  }
}
```

## Remove Connected Account
Removes a connected social media account.

**URL**: `/api/accounts/:accountId`
**Method**: `DELETE`
**Auth Required**: Yes

**Success Response (200 OK)**:
```json
{
  "message": "Account disconnected successfully"
}
```

## Refresh Account Token
Refreshes the access token for a connected account.

**URL**: `/api/accounts/:accountId/refresh-token`
**Method**: `POST`
**Auth Required**: Yes

**Success Response (200 OK)**:
```json
{
  "message": "Token refreshed successfully",
  "newAccessToken": "string"
}
```

## Error Responses

All endpoints may return these errors:

**401 Unauthorized**:
```json
{
  "message": "Authentication required"
}
```

**403 Forbidden**:
```json
{
  "message": "You don't have access to this account"
}
```

**404 Not Found**:
```json
{
  "message": "Account not found"
}
```

**400 Bad Request**:
```json
{
  "message": "Invalid request",
  "errors": [
    {
      "msg": "Invalid platform",
      "param": "platform",
      "location": "body"
    }
  ]
}
```

**500 Internal Server Error**:
```json
{
  "message": "Internal server error",
  "error": "Error details (only in development)"
}
```

## Supported Platforms
- Twitter
- Facebook
- Instagram
- LinkedIn

## Rate Limits
- Maximum 10 accounts per user
- Token refresh: Maximum 1 request per minute per account
- Account listing: Maximum 60 requests per hour 