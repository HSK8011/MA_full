# User Management API Documentation

## Get User Profile
Retrieves the current user's profile.

**URL**: `/api/users/profile`
**Method**: `GET`
**Auth Required**: Yes

**Success Response (200 OK)**:
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "isEmailVerified": boolean,
    "createdAt": "string",
    "settings": {
      "notifications": {
        "email": boolean,
        "push": boolean
      },
      "timezone": "string",
      "language": "string"
    }
  }
}
```

## Update User Profile
Updates the current user's profile information.

**URL**: `/api/users/profile`
**Method**: `PUT`
**Auth Required**: Yes

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "settings": {
    "notifications": {
      "email": boolean,
      "push": boolean
    },
    "timezone": "string",
    "language": "string"
  }
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "isEmailVerified": boolean,
    "settings": {
      "notifications": {
        "email": boolean,
        "push": boolean
      },
      "timezone": "string",
      "language": "string"
    }
  }
}
```

## Change Password
Changes the user's password.

**URL**: `/api/users/change-password`
**Method**: `POST`
**Auth Required**: Yes

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Password changed successfully"
}
```

## Delete Account
Permanently deletes the user's account.

**URL**: `/api/users/account`
**Method**: `DELETE`
**Auth Required**: Yes

**Request Body**:
```json
{
  "password": "string"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Account deleted successfully"
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

**400 Bad Request**:
```json
{
  "errors": [
    {
      "msg": "Invalid input",
      "param": "fieldName",
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

## Password Requirements
- Minimum 8 characters
- Must contain at least:
  - One uppercase letter
  - One lowercase letter
  - One number 