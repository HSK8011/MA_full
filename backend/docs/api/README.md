# API Documentation

This directory contains documentation for all the API endpoints in the application.

## Available APIs

1. [Authentication API](./auth.md) - User registration, login, and password management
2. [Analytics API](./analytics.md) - Social media analytics and metrics
3. [User Management API](./users.md) - User profile and settings management
4. [Social Media Accounts API](./accounts.md) - Social media account connections and management

## Base URL

All API endpoints are relative to the base URL:

- **Development**: `http://localhost:5000/api`
- **Production**: Based on deployment environment

## Authentication

Most API endpoints require authentication using JWT (JSON Web Token). After logging in or registering, you will receive a token that should be included in the `Authorization` header of subsequent requests:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

All APIs follow a consistent error response format:

```json
{
  "message": "Error message explaining what went wrong",
  "error": "Detailed error information (only in development environment)"
}
```

For validation errors, the format is:

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body" | "query" | "params"
    }
  ]
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting:

- **Authentication endpoints**: 5 requests per minute per IP
- **Analytics endpoints**: 60 requests per hour per user
- **Account management**: 30 requests per hour per user
- **User profile updates**: 10 requests per hour per user

## Testing

For testing purposes, you can use the test user:
- Email: test@example.com
- Password: password123

This user can be created using the `add-test-user` script. For more information, see [Scripts Documentation](../scripts.md).

## API Versioning

The current API version is v1. All endpoints are prefixed with `/api/v1/`.
Future versions will be available at `/api/v2/`, `/api/v3/`, etc.

## Security

- All endpoints use HTTPS in production
- Sensitive data is encrypted at rest
- Access tokens expire after 24 hours
- Refresh tokens expire after 30 days
- Password reset tokens expire after 1 hour 