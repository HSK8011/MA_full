# Authentication API Documentation

## Register User
Creates a new user account.

**URL**: `/api/auth/register`

**Method**: `POST`

**Request Body**:
```json
{
  "name": "string",     // Required, 2-50 characters
  "email": "string",    // Required, valid email format
  "password": "string"  // Required, min 8 chars, must contain uppercase, lowercase, and number
}
```

**Success Response (201 Created)**:
```json
{
  "message": "User registered successfully",
  "token": "string",    // JWT token
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "isEmailVerified": boolean
  }
}
```

**Error Responses**:

- `400 Bad Request`:
  ```json
  {
    "errors": [
      {
        "msg": "Name must be between 2 and 50 characters",
        "param": "name",
        "location": "body"
      }
    ]
  }
  ```
  
- `400 Bad Request`:
  ```json
  {
    "message": "User already exists with this email"
  }
  ```

- `500 Internal Server Error`:
  ```json
  {
    "message": "Error registering user",
    "error": "Error details (only in development)"
  }
  ```

## Login User
Authenticates a user and returns a token.

**URL**: `/api/auth/login`

**Method**: `POST`

**Request Body**:
```json
{
  "email": "string",    // Required, valid email format
  "password": "string"  // Required
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Login successful",
  "token": "string",    // JWT token
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "isEmailVerified": boolean
  }
}
```

**Error Responses**:

- `400 Bad Request`:
  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

- `401 Unauthorized`:
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

- `500 Internal Server Error`:
  ```json
  {
    "message": "Error logging in",
    "error": "Error details (only in development)"
  }
  ```

## Forgot Password
Request a password reset. In a production environment, this would send an email with a reset link.
For development purposes, a fixed OTP (000000) is used.

**URL**: `/api/auth/forgot-password`

**Method**: `POST`

**Request Body**:
```json
{
  "email": "string"    // Required, valid email format
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Password reset email sent"
}
```

**Error Responses**:

- `400 Bad Request`:
  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

- `404 Not Found`:
  ```json
  {
    "message": "User not found"
  }
  ```

- `500 Internal Server Error`:
  ```json
  {
    "message": "Error sending reset email",
    "error": "Error details (only in development)"
  }
  ```

## Reset Password
Reset user's password using the OTP received.

**URL**: `/api/auth/reset-password`

**Method**: `POST`

**Request Body**:
```json
{
  "email": "string",     // Required, valid email format
  "otp": "string",       // Required, must be "000000" for development
  "newPassword": "string" // Required, min 8 chars, must contain uppercase, lowercase, and number
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Password reset successful",
  "token": "string"      // New JWT token
}
```

**Error Responses**:

- `400 Bad Request`:
  ```json
  {
    "errors": [
      {
        "msg": "Invalid OTP",
        "param": "otp",
        "location": "body"
      }
    ]
  }
  ```

- `400 Bad Request`:
  ```json
  {
    "message": "Invalid or expired reset token"
  }
  ```

- `500 Internal Server Error`:
  ```json
  {
    "message": "Error resetting password",
    "error": "Error details (only in development)"
  }
  ```

## Authentication Headers
For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Password Requirements
- Minimum 8 characters
- Must contain at least:
  - One uppercase letter
  - One lowercase letter
  - One number

## Token Expiration
- JWT tokens expire after 24 hours
- After expiration, users must log in again to get a new token

## Test User
For development and testing purposes, you can use the following credentials:
- Email: test@example.com
- Password: password123

## Rate Limiting
- Login attempts are limited to 5 per minute per IP
- Registration attempts are limited to 3 per hour per IP 