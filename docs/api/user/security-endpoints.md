# Security API

## Overview
The Security API provides endpoints to manage user security settings, including password changes, two-factor authentication (2FA), and activity logging preferences. These endpoints enable users to maintain a secure account in the Marketing Automation Tool.

## Authentication
All endpoints require a valid JWT token in the Authorization header.

## Endpoints

### Get Security Settings

#### Endpoint
`GET /api/user/security-settings`

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
  "twoFactorEnabled": true,
  "activityLogsEnabled": true,
  "lastPasswordChange": "2019-10-02T14:30:00Z"
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

#### Example Usage
```typescript
const getSecuritySettings = async () => {
  try {
    const response = await fetch('/api/user/security-settings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch security settings');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching security settings:', error);
    throw error;
  }
};
```

### Change Password

#### Endpoint
`PUT /api/user/security/change-password`

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
| currentPassword | string | Yes | User's current password |
| newPassword | string | Yes | User's new password (minimum 8 characters) |

#### Example Request Body
```json
{
  "currentPassword": "current-password-123",
  "newPassword": "new-password-456"
}
```

#### Response
#### Success Response
- Status Code: 200
```json
{
  "message": "Password changed successfully",
  "lastPasswordChange": "2024-05-15T11:30:45Z"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "New password must be at least 8 characters long"
}
```

- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Current password is incorrect"
}
```

#### Example Usage
```typescript
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch('/api/user/security/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
```

### Toggle Two-Factor Authentication

#### Endpoint
`PUT /api/user/security/2fa`

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
| enabled | boolean | Yes | Whether to enable (true) or disable (false) 2FA |

#### Example Request Body
```json
{
  "enabled": true
}
```

#### Response
#### Success Response
- Status Code: 200
```json
{
  "message": "Two-factor authentication enabled successfully",
  "twoFactorEnabled": true,
  "setupRequired": true,
  "setupInfo": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "secretKey": "ABCDEFGHIJKLMNOP",
    "recoveryCodesCount": 10
  }
}
```

When disabling:
```json
{
  "message": "Two-factor authentication disabled successfully",
  "twoFactorEnabled": false
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

- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "Password verification required to disable 2FA"
}
```

#### Example Usage
```typescript
const toggle2FA = async (enabled) => {
  try {
    const response = await fetch('/api/user/security/2fa', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ enabled })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update 2FA settings');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating 2FA settings:', error);
    throw error;
  }
};
```

### Toggle Activity Logs

#### Endpoint
`PUT /api/user/security/activity-logs`

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
| enabled | boolean | Yes | Whether to enable (true) or disable (false) activity logging |

#### Example Request Body
```json
{
  "enabled": true
}
```

#### Response
#### Success Response
- Status Code: 200
```json
{
  "message": "Activity logging enabled successfully",
  "activityLogsEnabled": true
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

#### Example Usage
```typescript
const toggleActivityLogs = async (enabled) => {
  try {
    const response = await fetch('/api/user/security/activity-logs', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ enabled })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update activity logs settings');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating activity logs settings:', error);
    throw error;
  }
};
```

## Notes
- Password changes require the current password for verification
- New passwords must be at least 8 characters long
- Two-factor authentication uses TOTP (Time-based One-Time Password) standard
- When enabling 2FA, setup information including QR code and recovery codes is provided
- Activity logs store login attempts, password changes, and other security-related events
- All sensitive operations (password change, 2FA configuration) are logged 

## Overview
The Security API provides endpoints to manage user security settings, including password changes, two-factor authentication (2FA), and activity logging preferences. These endpoints enable users to maintain a secure account in the Marketing Automation Tool.

## Authentication
All endpoints require a valid JWT token in the Authorization header.

## Endpoints

### Get Security Settings

#### Endpoint
`GET /api/user/security-settings`

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
  "twoFactorEnabled": true,
  "activityLogsEnabled": true,
  "lastPasswordChange": "2019-10-02T14:30:00Z"
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

#### Example Usage
```typescript
const getSecuritySettings = async () => {
  try {
    const response = await fetch('/api/user/security-settings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch security settings');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching security settings:', error);
    throw error;
  }
};
```

### Change Password

#### Endpoint
`PUT /api/user/security/change-password`

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
| currentPassword | string | Yes | User's current password |
| newPassword | string | Yes | User's new password (minimum 8 characters) |

#### Example Request Body
```json
{
  "currentPassword": "current-password-123",
  "newPassword": "new-password-456"
}
```

#### Response
#### Success Response
- Status Code: 200
```json
{
  "message": "Password changed successfully",
  "lastPasswordChange": "2024-05-15T11:30:45Z"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "New password must be at least 8 characters long"
}
```

- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Current password is incorrect"
}
```

#### Example Usage
```typescript
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch('/api/user/security/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
```

### Toggle Two-Factor Authentication

#### Endpoint
`PUT /api/user/security/2fa`

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
| enabled | boolean | Yes | Whether to enable (true) or disable (false) 2FA |

#### Example Request Body
```json
{
  "enabled": true
}
```

#### Response
#### Success Response
- Status Code: 200
```json
{
  "message": "Two-factor authentication enabled successfully",
  "twoFactorEnabled": true,
  "setupRequired": true,
  "setupInfo": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "secretKey": "ABCDEFGHIJKLMNOP",
    "recoveryCodesCount": 10
  }
}
```

When disabling:
```json
{
  "message": "Two-factor authentication disabled successfully",
  "twoFactorEnabled": false
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

- Status Code: 400
```json
{
  "error": "Bad Request",
  "message": "Password verification required to disable 2FA"
}
```

#### Example Usage
```typescript
const toggle2FA = async (enabled) => {
  try {
    const response = await fetch('/api/user/security/2fa', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ enabled })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update 2FA settings');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating 2FA settings:', error);
    throw error;
  }
};
```

### Toggle Activity Logs

#### Endpoint
`PUT /api/user/security/activity-logs`

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
| enabled | boolean | Yes | Whether to enable (true) or disable (false) activity logging |

#### Example Request Body
```json
{
  "enabled": true
}
```

#### Response
#### Success Response
- Status Code: 200
```json
{
  "message": "Activity logging enabled successfully",
  "activityLogsEnabled": true
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

#### Example Usage
```typescript
const toggleActivityLogs = async (enabled) => {
  try {
    const response = await fetch('/api/user/security/activity-logs', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ enabled })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update activity logs settings');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating activity logs settings:', error);
    throw error;
  }
};
```

## Notes
- Password changes require the current password for verification
- New passwords must be at least 8 characters long
- Two-factor authentication uses TOTP (Time-based One-Time Password) standard
- When enabling 2FA, setup information including QR code and recovery codes is provided
- Activity logs store login attempts, password changes, and other security-related events
- All sensitive operations (password change, 2FA configuration) are logged 