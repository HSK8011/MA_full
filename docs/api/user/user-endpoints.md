# User API

## Overview
The User API provides access to user account data, including profile information, security settings, and user preferences. These endpoints enable the management of user accounts within the Marketing Automation Tool.

## Authentication
All endpoints require a valid JWT token in the Authorization header.

## Endpoints

### Get User Data

#### Endpoint
`GET /api/user/profile`

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
  "id": "usr_123456789",
  "name": "AIMDek Technologies",
  "email": "marketing@aimdek.com",
  "phone": "+91 98765 43210",
  "timezone": "Culcutta (+05:30)",
  "created_at": "2023-11-15T10:30:00Z",
  "updated_at": "2024-05-10T14:22:10Z",
  "subscription": {
    "plan": "pro",
    "status": "active",
    "expires_at": "2025-05-10T23:59:59Z"
  },
  "avatar_url": "https://assets.marketingautomation.com/avatars/usr_123456789.jpg"
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
  "message": "User profile not found"
}
```

#### Example Usage
```typescript
const getUserProfile = async () => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
```

### Update User Profile

#### Endpoint
`PUT /api/user/profile`

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
| name | string | No | User's full name |
| phone | string | No | User's phone number |
| timezone | string | No | User's preferred timezone |

#### Response
#### Success Response
- Status Code: 200
```json
{
  "id": "usr_123456789",
  "name": "AIMDek Technologies",
  "email": "marketing@aimdek.com",
  "phone": "+91 98765 43210",
  "timezone": "Culcutta (+05:30)",
  "updated_at": "2024-05-12T16:43:21Z"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "Invalid timezone format"
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
  "message": "User profile not found"
}
```

#### Example Usage
```typescript
const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    
    const updatedUserData = await response.json();
    return updatedUserData;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
```

## Notes
- The email address cannot be changed via the `PUT /api/user/profile` endpoint. A separate email change workflow with verification is required.
- Phone numbers are optional but if provided, they must be in a valid international format.
- Users cannot access or modify other users' profile data.
- For security reasons, the API never returns sensitive data like passwords or authentication tokens. 

## Overview
The User API provides access to user account data, including profile information, security settings, and user preferences. These endpoints enable the management of user accounts within the Marketing Automation Tool.

## Authentication
All endpoints require a valid JWT token in the Authorization header.

## Endpoints

### Get User Data

#### Endpoint
`GET /api/user/profile`

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
  "id": "usr_123456789",
  "name": "AIMDek Technologies",
  "email": "marketing@aimdek.com",
  "phone": "+91 98765 43210",
  "timezone": "Culcutta (+05:30)",
  "created_at": "2023-11-15T10:30:00Z",
  "updated_at": "2024-05-10T14:22:10Z",
  "subscription": {
    "plan": "pro",
    "status": "active",
    "expires_at": "2025-05-10T23:59:59Z"
  },
  "avatar_url": "https://assets.marketingautomation.com/avatars/usr_123456789.jpg"
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
  "message": "User profile not found"
}
```

#### Example Usage
```typescript
const getUserProfile = async () => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
```

### Update User Profile

#### Endpoint
`PUT /api/user/profile`

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
| name | string | No | User's full name |
| phone | string | No | User's phone number |
| timezone | string | No | User's preferred timezone |

#### Response
#### Success Response
- Status Code: 200
```json
{
  "id": "usr_123456789",
  "name": "AIMDek Technologies",
  "email": "marketing@aimdek.com",
  "phone": "+91 98765 43210",
  "timezone": "Culcutta (+05:30)",
  "updated_at": "2024-05-12T16:43:21Z"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "Invalid timezone format"
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
  "message": "User profile not found"
}
```

#### Example Usage
```typescript
const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    
    const updatedUserData = await response.json();
    return updatedUserData;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
```

## Notes
- The email address cannot be changed via the `PUT /api/user/profile` endpoint. A separate email change workflow with verification is required.
- Phone numbers are optional but if provided, they must be in a valid international format.
- Users cannot access or modify other users' profile data.
- For security reasons, the API never returns sensitive data like passwords or authentication tokens. 